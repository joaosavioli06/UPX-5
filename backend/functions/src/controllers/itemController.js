const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const ItemModel = require('../models/itemModel'); // Model
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Utils

const registrarNovoItem = async (req, res) => {
  try {
    const { tipo_material, descricao, imagem_url } = req.body;
    const uid_usuario = req.user.uid; // Pego pelo middleware de autenticação que fizemos

    if (!tipo_material || !imagem_url) {
      return res.status(400).json({ error: 'Tipo de material e imagem são obrigatórios.' });
    }

    const novoItem = {
      uid_usuario,
      tipo_material,
      descricao: descricao || "",
      imagem_url,
      status: 'pendente', // Aguardando aprovação do Síndico
      pontos_gerados: 10, // Pontuação padrão para teste
      criado_em: FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection('itens_descarte').add(novoItem);

    res.status(201).json({
      message: 'Descarte registrado com sucesso! Aguarde a validação.',
      id_item: docRef.id
    });
  } catch (error) {
    console.error(`[ItemController] Erro: ${error.message}`);
    res.status(500).json({ error: 'Erro ao registrar o descarte.' });
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
    res.status(500).json({ error: 'Erro ao listar itens.' });
  }
};

module.exports = { registrarNovoItem, listarItensPorUsuario };