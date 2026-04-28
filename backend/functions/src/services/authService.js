const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const cadastrarUsuario = async (nome, email, password, tipo_perfil, codigoAcesso) => {
  let userRecord;
  let isAdmin = false; // Padrão é sempre falso

  try {
    // 1. Validar código de acesso se o perfil solicitado for 'sindico'
    if (tipo_perfil === 'sindico') {
      
  const configDoc = await admin.firestore().collection('config').doc('acesso_sindico').get();
  
  if (!configDoc.exists) {
    throw new Error('Configuração de acesso não encontrada no banco.');
  }

  // Ajustado para .code conforme seu print
  const codigoCorreto = configDoc.data().code;

  if (codigoAcesso === codigoCorreto) {
    isAdmin = true;
  } else {
    throw new Error('Código de acesso para síndico inválido.');
  }
}

    // 2. Criar usuário no Firebase Auth
    userRecord = await admin.auth().createUser({ email, password, displayName: nome });

    // 3. Salvar no Firestore com o resultado da validação
    await admin.firestore().collection('usuarios').doc(userRecord.uid).set({
      uid: userRecord.uid,
      nome,
      email,
      tipo_perfil,
      is_admin: isAdmin, // Aqui entra o true ou false validado
      status: 'ativo',
      criado_em: FieldValue.serverTimestamp()
    });

    // 4. Definir Claims de segurança
    await admin.auth().setCustomUserClaims(userRecord.uid, { 
      role: tipo_perfil,
      admin: isAdmin 
    });

    return { uid: userRecord.uid, email: userRecord.email };
  } catch (error) {
    if (userRecord) await admin.auth().deleteUser(userRecord.uid);
    throw error;
  }
};

const loginUsuario = async (email, password) => {
  try {
    // No ambiente local/node, o Firebase Admin não faz login com senha direto.
    // Para a AC2, simulamos a validação ou usamos o Identity Platform.
    // Mas a forma mais robusta é buscar o usuário e validar o status:
    
    const userRecord = await admin.auth().getUserByEmail(email);
    const userDoc = await admin.firestore().collection('usuarios').doc(userRecord.uid).get();
    
    if (!userDoc.exists || userDoc.data().status !== 'ativo') {
      throw new Error('Usuário inativo ou não encontrado.');
    }

    // Gerar um token customizado para o Mobile
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    return {
      token: customToken,
      usuario: userDoc.data()
    };
  } catch (error) {
    console.error(`[AuthService] Erro no login: ${error.message}`);
    throw error;
  }
};

module.exports = { cadastrarUsuario, loginUsuario };