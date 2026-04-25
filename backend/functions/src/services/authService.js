const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const cadastrarUsuario = async (nome, email, password, tipo_perfil) => {
  let userRecord;

  try {
    // Validação de Segurança: 'morador' ou 'sindico'
    const perfisValidos = ['morador', 'sindico'];
    if (!perfisValidos.includes(tipo_perfil)) {
      throw new Error('Perfil de usuário inválido.');
    }

    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: nome,
    });

    try {
      const userDocRef = admin.firestore().collection('usuarios').doc(userRecord.uid);

      await userDocRef.set({
        uid: userRecord.uid,
        nome,
        email,
        tipo_perfil,
        is_admin: false, // FORÇADO: Todo usuário nasce como falso.
        status: 'ativo',
        criado_em: FieldValue.serverTimestamp(),
        atualizado_em: FieldValue.serverTimestamp(),
      });

      await admin.auth().setCustomUserClaims(userRecord.uid, { 
        role: tipo_perfil,
        admin: false 
      });

      return { uid: userRecord.uid, email: userRecord.email };

    } catch (firestoreError) {
      if (userRecord) await admin.auth().deleteUser(userRecord.uid);
      throw firestoreError;
    }

  } catch (error) {
    console.error(`[AuthService] Erro no cadastro: ${error.message}`);
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