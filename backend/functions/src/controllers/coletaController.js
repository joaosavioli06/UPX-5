const admin = require('firebase-admin');
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Utils

const listarColetasPendentes = async (req, res) => {
  try {
    // O Síndico busca tudo que está 'pendente' no condomínio
    const snapshot = await admin.firestore()
      .collection('itens_descarte')
      .where('status', '==', 'pendente')
      .orderBy('criado_em', 'asc')
      .get();

    const coletas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return sendSuccess(res, 'Coletas pendentes listadas', coletas);
  } catch (error) {
    return sendError(res, 'Erro ao listar coletas pendentes');
  }
};

const validarColeta = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status_final } = req.body; // 'aprovado' ou 'rejeitado'

    const itemRef = admin.firestore().collection('itens_descarte').doc(itemId);
    const itemDoc = await itemRef.get();

    if (!itemDoc.exists) return sendError(res, 'Item não encontrado', 404);

    await itemRef.update({
      status: status_final,
      validado_em: admin.firestore.FieldValue.serverTimestamp(),
      validado_por: req.user.uid // ID do Síndico que validou
    });

    return sendSuccess(res, `Item ${status_final} com sucesso!`);
  } catch (error) {
    return sendError(res, 'Erro ao validar coleta');
  }
};

module.exports = { listarColetasPendentes, validarColeta };