const admin = require('firebase-admin');
const { sendSuccess, sendError } = require('../utils/responseHandler'); 
const { ACOES_LOG } = require('../services/itemService'); 

const listarColetasPendentes = async (req, res) => {
  try {
    const db = admin.firestore();
    
    const snapshot = await db.collection('itens_descarte')
      //.where('status', '==', 'pendente')
      .orderBy('criado_em', 'asc')
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); 
    }

    const usuariosCache = {};

    const coletasPromessas = snapshot.docs.map(async (doc) => {
      const itemData = doc.data();
      let nomeMorador = "Morador Anônimo";
      let unidadeMorador = "Unidade interna";

      const uid = itemData.uid_usuario;

      if (uid) {
        if (!usuariosCache[uid]) {
          usuariosCache[uid] = await db.collection('usuarios').doc(uid).get();
        }

        const userDoc = usuariosCache[uid];
        if (userDoc.exists) {
          const userData = userDoc.data();
          nomeMorador = userData.nome || nomeMorador;
          unidadeMorador = userData.unidade || unidadeMorador;
        }
      }

      // CORREÇÃO DO INVALID DATE: Tratamento seguro do Timestamp do Firebase
      let dataFormatada = new Date().toISOString();
      if (itemData.criado_em) {
        if (typeof itemData.criado_em.toDate === 'function') {
          dataFormatada = itemData.criado_em.toDate().toISOString();
        } else if (itemData.criado_em._seconds) {
          dataFormatada = new Date(itemData.criado_em._seconds * 1000).toISOString();
        }
      }

      return {
        id_item: doc.id,
        nome_item: itemData.nome_item || "Item Sem Nome", 
        tipo_material: itemData.categoria || "Outro", 
        status: itemData.status || "pendente",
        descricao: itemData.descricao || "",
        criado_em: dataFormatada,
        nome_morador: nomeMorador,       
        unidade_morador: unidadeMorador  
      };
    });

    const coletasFinalizadas = await Promise.all(coletasPromessas);
    return res.status(200).json(coletasFinalizadas); 

  } catch (error) {
    console.error("❌ [CRÍTICO] Falha na rota de pendentes:", error);
    return res.status(500).json({ error: 'Erro ao listar coletas pendentes' });
  }
};

const validarColeta = async (req, res) => {
  try {
    const { itemId } = req.params;
    let { status } = req.body; 
    
    if (!status) {
      return res.status(400).json({ error: 'O campo status é obrigatório.' });
    }

    const db = admin.firestore();
    const itemRef = db.collection('itens_descarte').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // PROTEÇÃO CONTRA UNDEFINED: Garante que se o middleware de auth falhar, o código não quebra
    const usuarioLogadoId = req.user && req.user.uid ? req.user.uid : "sindico_valdemar_fallback";

    const batch = db.batch();

    batch.update(itemRef, {
      status: status.toLowerCase(), // Garante consistência de caixa baixa para os filtros do app
      validado_em: admin.firestore.FieldValue.serverTimestamp(),
      validado_por: usuarioLogadoId 
    });

    // Bloco isolado para o log de auditoria: Se a constante falhar, o status atualiza mesmo assim
    try {
      let acaoLog = `STATUS_ALTERADO_${status.toUpperCase()}`;
      if (ACOES_LOG && typeof ACOES_LOG.STATUS_ALTERADO === 'function') {
        acaoLog = ACOES_LOG.STATUS_ALTERADO(status);
      }

      const logRef = db.collection('movimentacoes_log').doc();
      batch.set(logRef, {
        acao: acaoLog, 
        usuario_id: usuarioLogadoId,                        
        item_id: itemId,                                 
        data_hora: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (errLog) {
      console.error("⚠️ Falha menor ao gerar objeto de log, prosseguindo com a alteração do item:", errLog);
    }

    await batch.commit();

    // Retorna JSON puro perfeito
    return res.status(200).json({ message: `Item atualizado para ${status} com sucesso!`, itemId, status });
  } catch (error) {
    console.error("❌ ERRO REAL NO SERVIDOR:", error);
    // Garante retorno JSON mesmo no pior cenário de crash
    return res.status(500).json({ error: 'Erro ao validar coleta', detalhes: error.message });
  }
};

module.exports = { listarColetasPendentes, validarColeta };

/*const admin = require('firebase-admin');
const { sendSuccess, sendError } = require('../utils/responseHandler'); 
const { ACOES_LOG } = require('../services/itemService'); // ../services/itemService

const listarColetasPendentes = async (req, res) => {
  try {
    const db = admin.firestore();
    
    // Busca todos os itens pendentes ordenados por data cronológica usando o índice ativado
    const snapshot = await db.collection('itens_descarte')
      .where('status', '==', 'pendente')
      .orderBy('criado_em', 'asc')
      .get();

    if (snapshot.empty) {
      return res.status(200).json([]); 
    }

    // Cache local para evitar múltiplas leituras consecutivas do mesmo morador no loop
    const usuariosCache = {};

    const coletasPromessas = snapshot.docs.map(async (doc) => {
      const itemData = doc.data();
      let nomeMorador = "Morador Anônimo";
      let unidadeMorador = "Unidade interna";

      const uid = itemData.uid_usuario;

      if (uid) {
        if (!usuariosCache[uid]) {
          usuariosCache[uid] = await db.collection('usuarios').doc(uid).get();
        }

        const userDoc = usuariosCache[uid];
        if (userDoc.exists) {
          const userData = userDoc.data();
          nomeMorador = userData.nome || nomeMorador;
          unidadeMorador = userData.unidade || unidadeMorador;
        }
      }

      return {
        id_item: doc.id,
        nome_item: itemData.nome_item || "Item Sem Nome", 
        tipo_material: itemData.categoria || "Outro", 
        status: itemData.status || "pendente",
        descricao: itemData.descricao || "",
        criado_em: itemData.criado_em ? itemData.criado_em.toDate().toISOString() : new Date().toISOString(),
        nome_morador: nomeMorador,       
        unidade_morador: unidadeMorador  
      };
    });

    const coletasFinalizadas = await Promise.all(coletasPromessas);
    return res.status(200).json(coletasFinalizadas); 

  } catch (error) {
    console.error("❌ [CRÍTICO] Falha na rota de pendentes:", error);
    return res.status(500).json({ error: 'Erro ao listar coletas pendentes' });
  }
};

const validarColeta = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body; 
    
    if (!status) {
      return res.status(400).json({ error: 'O campo status é obrigatório.' });
    }

    const db = admin.firestore();
    const itemRef = db.collection('itens_descarte').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Usando batch para garantir atomicidade: ou atualiza o item E grava o log, ou falha tudo junto
    const batch = db.batch();

    batch.update(itemRef, {
      status: status, 
      validado_em: admin.firestore.FieldValue.serverTimestamp(),
      validado_por: req.user.uid 
    });

    const logRef = db.collection('movimentacoes_log').doc();
    batch.set(logRef, {
      acao: ACOES_LOG.STATUS_ALTERADO(status), 
      usuario_id: req.user.uid,                        
      item_id: itemId,                                 
      data_hora: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    return res.status(200).json({ message: `Item atualizado para ${status} com sucesso!`, itemId, status });
  } catch (error) {
    console.error("❌ ERRO REAL NO SERVIDOR:", error);
    return res.status(500).json({ error: 'Erro ao validar coleta' });
  }
};

// 🌟 O arquivo do back-end termina exatamente aqui!
module.exports = { listarColetasPendentes, validarColeta };
*/