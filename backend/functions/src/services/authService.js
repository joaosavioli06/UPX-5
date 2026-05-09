const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const cadastrarUsuario = async (nome, email, password, tipo_perfil, codigoAcesso, userData) => {
  let userRecord;
  let isAdmin = false;

  try {
    // 1. Validar código de acesso para síndico
    if (tipo_perfil === 'sindico') {
      const configDoc = await admin.firestore().collection('config').doc('acesso_sindico').get();
      if (!configDoc.exists) throw new Error('Configuração de acesso não encontrada.');
      
      if (codigoAcesso !== configDoc.data().code) {
        throw new Error('Código de acesso para síndico inválido.');
      }
      isAdmin = true;
    }

    // 2. Criar usuário no Firebase Auth
    userRecord = await admin.auth().createUser({ email, password, displayName: nome });

    // 3. Salvar perfil completo no Firestore
    await admin.firestore().collection('usuarios').doc(userRecord.uid).set({
      uid: userRecord.uid,
      nome,
      email,
      tipo_perfil,
      is_admin: isAdmin,
      status: 'ativo',
      
      // Dados da Unidade (Sincronizado com unit.tsx)
      unidade: userData.unit || '',
      tipo_moradia: userData.type || '',

      // Dados do Veículo (Sincronizado com vehicle.tsx)
      veiculo: {
        possui: userData.hasVehicle === true,
        placa: userData.plate || '',
        modelo: userData.model || '',
        color: userData.color || ''
      },

      preferencias: userData.preferencias || [],
      criado_em: FieldValue.serverTimestamp()
    });

    // 4. Definir Claims de segurança
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: tipo_perfil, admin: isAdmin });

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