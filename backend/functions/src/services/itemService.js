const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid'); // Você precisará instalar: npm install uuid

const ACOES_LOG = {
  CRIACAO_ITEM: 'CRIAÇÃO_ITEM_DESCARTE',
  STATUS_ALTERADO: (status) => `STATUS_ALTERADO_${status.toUpperCase()}`
};

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
      uid_usuario: uidUsuario, // ITEM A CORRIGIDO: de morador_id para uid_usuario        
      categoria: dadosItem.categoria || '', 
      nome_item: dadosItem.nome || '',      
      status: 'pendente',   
      foto_url: dadosItem.foto_url || '',   
      ia_confianca: 0,                
      criado_em: admin.firestore.FieldValue.serverTimestamp(), 
    };

    batch.set(itemRef, novoItem);

    // Criar um log de auditoria
    const logRef = db.collection('movimentacoes_log').doc();
    batch.set(logRef, {
      acao: ACOES_LOG.CRIACAO_ITEM, // Usando a constante do Ponto 3
      usuario_id: uidUsuario,
      item_id: itemID,
      username: dadosItem.nome_usuario || 'Morador Não Identificado', // ITEM B CORRIGIDO: evitamos o ReferenceError buscando do dadosItem
      data_hora: admin.firestore.FieldValue.serverTimestamp()
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

// Exportamos também as ações caso precise usar em outros lugares do app
module.exports = { registrarDescarte, ACOES_LOG };