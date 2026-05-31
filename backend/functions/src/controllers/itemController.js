const admin = require('firebase-admin');
const ItemModel = require('../models/itemModel'); // Model
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Utils

const registrarNovoItem = async (req, res) => {
  try {
    console.log("\n📥 [API Rest] Recebendo requisição JSON para registro de item...");
    
    // 🌟 Pegamos tudo direto do req.body (inclusive a imagem_url que o celular gerou)
    const { tipo_material, nome_item, observacoes, imagem_url } = req.body;
    const uid_usuario = req.user ? req.user.uid : null;

    console.log("📦 Dados recebidos no Body:", JSON.stringify(req.body, null, 2));

    if (!tipo_material || !nome_item) {
      return res.status(400).json({ error: 'O nome do item e o tipo de material são obrigatórios.' });
    }

    const novoItem = {
      uid_usuario: uid_usuario || req.body.morador_id || "uid_desconhecido",
      nome_item: nome_item,
      tipo_material: tipo_material,
      descricao: observacoes || "",
      imagem_url: imagem_url || "", // Se não foi enviada foto, salva como string vazia
      status: 'pendente',
      pontos_gerados: 10,
      criado_em: admin.firestore.Timestamp.now(), 
    };

    console.log("💾 Gravando diretamente no Firestore...");
    const docRef = await admin.firestore().collection('itens_descarte').add(novoItem);
    console.log(`✨ Documento criado com sucesso! ID: ${docRef.id}`);

    return res.status(201).json({
      message: 'Descarte registrado com sucesso!',
      id_item: docRef.id,
      tokenQR: docRef.id
    });

  } catch (error) {
    console.error("🚨 [Erro no Servidor]:", error);
    return res.status(500).json({
      error: "Ocorreu um erro interno no servidor.",
      success: false,
      detalheDoCrash: error.message
    });
  }
};

const listarItensPorUsuario = async (req, res) => {
  try {
    const uid = req.user.uid;
    const snapshot = await admin.firestore()
      .collection('itens_descarte')
      .where('uid_usuario', '==', uid)
      .orderBy('criado_em', 'desc')
      .get();

    const itens = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(itens);
  } catch (error) {
    console.error(`[ItemController] Erro na listagem: ${error.message}`);
    res.status(500).json({ error: 'Erro ao listar itens.' });
  }
};

const excluirDescarte = async (req, res) => {
  try {
    const { id_item } = req.params;
    const uid_usuario = req.user.uid;
    const db = admin.firestore();

    const itemRef = db.collection('itens_descarte').doc(id_item);
    const doc = await itemRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Descarte não encontrado.' });
    }

    if (doc.data().uid_usuario !== uid_usuario) {
      return res.status(403).json({ error: 'Você não tem permissão para excluir este registro.' });
    }

    await admin.firestore().collection('movimentacoes_log').add({
      acao: 'EXCLUSAO_ITEM_DESCARTE',
      usuario_id: uid_usuario, // ⬅️ Usa a constante que você já definiu na linha 70
      item_id: id_item,         // ⬅️ Usa a constante que você já definiu na linha 69
      data_hora: admin.firestore.FieldValue.serverTimestamp()
    });

    await itemRef.delete();
    res.status(200).json({ message: 'Descarte removido do sistema com sucesso!' });
  } catch (error) {
    console.error(`[ItemController] Erro na exclusão: ${error.message}`);
    res.status(500).json({ error: 'Erro interno ao tentar excluir o descarte.' });
  }
};

module.exports = { registrarNovoItem, listarItensPorUsuario, excluirDescarte };