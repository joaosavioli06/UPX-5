const admin = require('firebase-admin');

const aprovarDescarte = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { aprovado, pontos } = req.body; // aprovado: true/false

    const statusFinal = aprovado ? 'aprovado' : 'rejeitado';

    await admin.firestore().collection('itens_descarte').doc(itemId).update({
      status: statusFinal,
      pontos_gerados: aprovado ? pontos : 0,
      atualizado_em: admin.firestore.FieldValue.serverTimestamp()
    });

    // Se aprovado, aqui poderíamos disparar a soma de pontos no perfil do morador
    res.status(200).json({ message: `Item ${statusFinal} com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar aprovação.' });
  }
};

module.exports = { aprovarDescarte };