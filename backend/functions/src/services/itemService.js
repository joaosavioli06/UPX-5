const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Você precisará instalar: npm install uuid


const registrarDescarte = async (uidUsuario, dadosItem) => {
  const db = admin.firestore();
  const batch = db.batch(); 

  try {
    // 1. Gerar o Token Único do QR Code
    const tokenUUID = uuidv4();
    const itemID = db.collection('itens_descarte').doc().id;

    const itemRef = db.collection('itens_descarte').doc(itemID);

    const novoItem = {
      qr_code_token: tokenUUID,       
      morador_id: uidUsuario,         
      categoria: dadosItem.categoria || '', 
      nome_item: dadosItem.nome || '',      
      status: 'aguardando_coleta',   
      foto_url: dadosItem.foto_url || '',   
      ia_confianca: 0,                
      data_registro: admin.firestore.FieldValue.serverTimestamp(), 
    };

    batch.set(itemRef, novoItem);

    // Criar um log de auditoria
    const logRef = db.collection('logs_auditoria').doc();
    batch.set(logRef, {
      acao: 'CRIAÇÃO_ITEM_DESCARTE',
      usuario_id: uidUsuario,
      item_id: itemID,
      data: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    return {
      success: true,
      itemID: itemID,
      tokenQR: tokenUUID
    };

  } catch (error) {
    console.error(`[ItemService] Erro ao registrar descarte: ${error.message}`);
    throw new Error('Falha ao processar registro de descarte.');
  }
};

module.exports = { registrarDescarte };