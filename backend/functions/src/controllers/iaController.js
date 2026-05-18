const visionService = require('../services/visionService');
const { sendSuccess, sendError } = require('../utils/responseHandler');


// POST /api/ia/analisar-imagem
// Body: { imagem_base64: "..." }
// Auth: Token obrigatório (validateToken)

const analisarImagem = async (req, res) => {
  try {
    const { imagem_base64 } = req.body;

    if (!imagem_base64) {
      return sendError(res, 'Campo imagem_base64 é obrigatório.', 400);
    }

    // Remove o prefixo 
    const base64Limpo = imagem_base64.replace(/^data:image\/\w+;base64,/, '');

    // Valida tamanho mínimo
    if (base64Limpo.length < 100) {
      return sendError(res, 'Imagem inválida ou muito pequena.', 400);
    }

    const resultado = await visionService.analisarImagem(base64Limpo);

    return sendSuccess(res, resultado.mensagem, {
      tipo_material: resultado.tipo_material,
      confianca: resultado.confianca,
      labels_detectados: resultado.labels_detectados
    });

  } catch (error) {
    console.error(`[IAController] Erro: ${error.message}`);
    return sendError(res, `Erro ao analisar imagem: ${error.message}`, 500);
  }
};

// POST /api/ia/analisar-e-registrar
// Body: { imagem_base64: "...", descricao: "..." }
// Auth: Token obrigatório

const analisarERegistrar = async (req, res) => {
  const admin = require('firebase-admin');
  const { FieldValue } = require('firebase-admin/firestore');

  try {
    const { imagem_base64, descricao, imagem_url } = req.body;
    const uid_usuario = req.user.uid;

    if (!imagem_base64) {
      return sendError(res, 'Campo imagem_base64 é obrigatório.', 400);
    }

    const base64Limpo = imagem_base64.replace(/^data:image\/\w+;base64,/, '');
    const analise = await visionService.analisarImagem(base64Limpo);

    const novoItem = {
      uid_usuario,
      tipo_material: analise.tipo_material,
      descricao: descricao || '',
      imagem_url: imagem_url || '',
      status: 'pendente',
      pontos_gerados: calcularPontos(analise.tipo_material),
      ia_confianca: analise.confianca,
      ia_labels: analise.labels_detectados,
      criado_em: FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore()
      .collection('itens_descarte')
      .add(novoItem);

    return sendSuccess(res, 'Descarte registrado com análise da IA!', {
      id_item: docRef.id,
      tipo_material: analise.tipo_material,
      confianca: analise.confianca,
      mensagem_ia: analise.mensagem,
      pontos_gerados: novoItem.pontos_gerados
    }, 201);

  } catch (error) {
    console.error(`[IAController] Erro em analisarERegistrar: ${error.message}`);
    return sendError(res, `Erro ao processar: ${error.message}`, 500);
  }
};

const calcularPontos = (tipo_material) => {
  const tabela = {
    plastico: 10,
    papel: 5,
    metal: 15,
    vidro: 12,
    eletronico: 20,
    organico: 3,
    perigoso: 25,      
    nao_identificado: 5
  };
  return tabela[tipo_material] || 5;
};

module.exports = { analisarImagem, analisarERegistrar };
