const axios = require('axios');

// ============================================================
// Mapa de categorias: palavras-chave detectadas → tipo_material
// ============================================================
const MATERIAL_MAP = {
  // PLÁSTICO
  plastico: [
    'plastic', 'bottle', 'plastic bottle', 'container', 'plastic bag',
    'packaging', 'jug', 'lid', 'cap', 'straw', 'cup', 'styrofoam',
    'foam', 'tray', 'wrapper', 'pet bottle', 'plastic container'
  ],

  // PAPEL / PAPELÃO
  papel: [
    'paper', 'cardboard', 'newspaper', 'magazine', 'book', 'box',
    'carton', 'envelope', 'notebook', 'tissue', 'paper bag',
    'document', 'pamphlet', 'brochure'
  ],

  // METAL
  metal: [
    'metal', 'can', 'aluminum', 'tin', 'steel', 'iron', 'copper',
    'bronze', 'nail', 'screw', 'wire', 'foil', 'aluminum can',
    'tin can', 'aerosol', 'battery', 'batteries', 'pile'
  ],

  // VIDRO
  vidro: [
    'glass', 'glass bottle', 'jar', 'wine bottle', 'glass container',
    'mirror', 'window', 'crystal'
  ],

  // ELETRÔNICO / PILHAS
  eletronico: [
    'electronics', 'electronic', 'phone', 'smartphone', 'computer',
    'keyboard', 'mouse', 'cable', 'charger', 'battery', 'batteries',
    'circuit board', 'tablet', 'remote control', 'headphones',
    'earphones', 'television', 'monitor', 'lamp', 'light bulb',
    'fluorescent', 'led'
  ],

  // ORGÂNICO
  organico: [
    'food', 'fruit', 'vegetable', 'organic', 'leaves', 'plant',
    'compost', 'banana', 'apple', 'orange', 'bread', 'meat',
    'egg', 'coffee grounds', 'shell', 'peel'
  ],

  // PERIGOSO / HOSPITALAR
  perigoso: [
    'syringe', 'needle', 'medicine', 'chemical', 'paint', 'solvent',
    'pesticide', 'bleach', 'acid', 'hazardous', 'toxic', 'oil',
    'grease', 'motor oil'
  ]
};

// ============================================================
// Classifica os labels retornados pela Vision API
// ============================================================
const classificarMaterial = (labels) => {
  const labelsLower = labels.map(l => l.description.toLowerCase());

  let melhorCategoria = 'nao_identificado';
  let melhorConfianca = 0;

  for (const [categoria, palavrasChave] of Object.entries(MATERIAL_MAP)) {
    for (const label of labels) {
      const descricao = label.description.toLowerCase();
      if (palavrasChave.some(kw => descricao.includes(kw))) {
        // Usa o score da Vision como confiança
        if (label.score > melhorConfianca) {
          melhorConfianca = label.score;
          melhorCategoria = categoria;
        }
      }
    }
  }

  return {
    tipo_material: melhorCategoria,
    confianca: Math.round(melhorConfianca * 100), // ex: 87 (%)
    labels_detectados: labelsLower.slice(0, 10)   // top 10 para debug
  };
};

// ============================================================
// Chama a Google Cloud Vision API com a imagem em base64
// ============================================================
const analisarImagem = async (imagemBase64) => {
  try {
    const API_KEY = process.env.GOOGLE_VISION_API_KEY;

    if (!API_KEY) {
      throw new Error('GOOGLE_VISION_API_KEY não configurada nas variáveis de ambiente.');
    }

    const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

    const payload = {
      requests: [
        {
          image: {
            content: imagemBase64 // Base64 sem o prefixo "data:image/..."
          },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 20 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
          ]
        }
      ]
    };

    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000 // 15s timeout
    });

    const resultado = response.data.responses[0];

    // Combina labels de LABEL_DETECTION e OBJECT_LOCALIZATION
    const labelAnnotations = resultado.labelAnnotations || [];
    const objectAnnotations = (resultado.localizedObjectAnnotations || []).map(obj => ({
      description: obj.name,
      score: obj.score
    }));

    const todosLabels = [...labelAnnotations, ...objectAnnotations];

    if (todosLabels.length === 0) {
      return {
        tipo_material: 'nao_identificado',
        confianca: 0,
        labels_detectados: [],
        mensagem: 'Nenhum objeto reconhecido na imagem. Tente uma foto mais clara.'
      };
    }

    const classificacao = classificarMaterial(todosLabels);

    return {
      ...classificacao,
      mensagem: gerarMensagem(classificacao.tipo_material, classificacao.confianca)
    };

  } catch (error) {
    if (error.response) {
      // Erro da própria API do Google
      const googleError = error.response.data?.error?.message || 'Erro desconhecido na Vision API';
      console.error(`[VisionService] Erro Google: ${googleError}`);
      throw new Error(`Vision API: ${googleError}`);
    }
    console.error(`[VisionService] Erro: ${error.message}`);
    throw error;
  }
};

// ============================================================
// Gera mensagem amigável para o usuário mobile
// ============================================================
const gerarMensagem = (tipo, confianca) => {
  const nomes = {
    plastico: 'Plástico ♻️',
    papel: 'Papel/Papelão ♻️',
    metal: 'Metal/Alumínio ♻️',
    vidro: 'Vidro ♻️',
    eletronico: 'Lixo Eletrônico ⚡',
    organico: 'Resíduo Orgânico 🌱',
    perigoso: 'Resíduo Perigoso ⚠️',
    nao_identificado: 'Não Identificado ❓'
  };

  const nome = nomes[tipo] || tipo;

  if (tipo === 'nao_identificado') {
    return 'Não foi possível identificar o material. Por favor, selecione manualmente.';
  }

  if (confianca >= 70) {
    return `Material identificado como ${nome} com ${confianca}% de confiança!`;
  }

  return `Possivelmente ${nome} (${confianca}% de confiança). Confirme antes de enviar.`;
};

module.exports = { analisarImagem };
