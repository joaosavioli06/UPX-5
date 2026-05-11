const { FieldValue } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

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
      
      // Dados da Unidade (basic.tsx)
      cpf: userData?.cpf || '', 
      telefone: userData?.telefone.replace(/\D/g, '') || '',

      // Dados da Unidade (unit.tsx)
      unidade: userData.unit || '',
      tipo_moradia: userData.type || '',

      // Dados do Veículo (vehicle.tsx)
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
        const API_KEY = process.env.WEB_API_KEY_AUTH;

        if (!API_KEY) {
            throw new Error("Erro de configuração: WEB_API_KEY_AUTH não definida.");
        }

        // 1. Validação REAL de senha via API REST do Firebase
        const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
        
        const authResponse = await axios.post(authUrl, {
            email,
            password,
            returnSecureToken: true
        });

        // O localId retornado pela API do Google é o UID do usuário
        const uid = authResponse.data.localId;

        // 2. Busca os dados complementares no Firestore (nome, unidade, status, etc)
        const userDoc = await admin.firestore().collection('usuarios').doc(uid).get();

        if (!userDoc.exists) {
            throw new Error("Perfil do usuário não encontrado no banco de dados.");
        }

        const dadosUsuario = userDoc.data();

        // 3. Verificação de status (conforme sua lógica original)
        if (dadosUsuario.status !== 'ativo') {
            throw new Error("Usuário inativo ou não autorizado.");
        }

        // 4. Gera um Custom Token para o Mobile (padrão de segurança)
        const customToken = await admin.auth().createCustomToken(uid);

        return {
            token: customToken,
            usuario: {
                uid: uid,
                ...dadosUsuario
            }
        };

    } catch (error) {
        // Tratamento de erro específico para senha/email errados
        const errorMsg = error.response?.data?.error?.message;
        
        if (errorMsg === 'INVALID_PASSWORD' || errorMsg === 'EMAIL_NOT_FOUND') {
            throw new Error("E-mail ou senha incorretos.");
        }
        
        console.error(`[AuthService] Erro no login: ${error.message}`);
        throw error;
    }
};

module.exports = { cadastrarUsuario, loginUsuario };