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

module.exports = { cadastrarUsuario };