const { FieldValue } = require('firebase-admin/firestore');
const admin = require('firebase-admin');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cadastrarUsuario = async (nome, email, password, tipo_perfil, codigoAcesso, userData) => {
  let userRecord;
  let isAdmin = false;

  if (userData?.telefone) {
      // 1. Limpa o telefone vindo do celular (mantém só números)
      const telEnviadoLimpo = userData.telefone.replace(/\D/g, '');

      // 2. Consulta direta indexada no Firestore (Rápido e sem loop!)
      const queryTelefone = await admin.firestore()
        .collection('usuarios')
        .where('telefone', '==', telEnviadoLimpo)
        .get();

      // 3. Se a consulta não estiver vazia, significa que o número já existe
      if (!queryTelefone.empty) {
        throw new Error('Este número de telefone já está cadastrado em outra conta.');
      }
    }

  try {
    if (tipo_perfil === 'sindico') {
      const configDoc = await admin.firestore().collection('config').doc('acesso_sindico').get();
      if (!configDoc.exists) throw new Error('Configuração de acesso não encontrada.');
      
      if (codigoAcesso !== configDoc.data().code) {
        throw new Error('Código de acesso para síndico inválido.');
      }
      isAdmin = true;
    }

    userRecord = await admin.auth().createUser({ email, password, displayName: nome });

    await admin.firestore().collection('usuarios').doc(userRecord.uid).set({
    uid: userRecord.uid,
    nome,
    email,
    role: tipo_perfil, 
    is_admin: isAdmin,
    status: 'ativo',
  
    cpf: userData?.cpf || '', 
    telefone: userData?.telefone?.replace(/\D/g, '') || '',
    unidade: userData?.unit || '',
    tipo_moradia: userData?.type || '',

    veiculo: {
    possui: userData?.hasVehicle === true,
    placa: userData?.plate || '',
    modelo: userData?.model || '',
    color: userData?.color || ''
  },

  
    preferencias: [], // Deixe vazio por enquanto ou mapeie apenas campos de tema/notificação
    criado_em: FieldValue.serverTimestamp()
});

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
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error("Erro de configuração: JWT_SECRET não definida no arquivo .env.");
        }

        if (!API_KEY) {
            throw new Error("Erro de configuração: WEB_API_KEY_AUTH não definida.");
        }

        const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
        
        const authResponse = await axios.post(authUrl, {
            email,
            password,
            returnSecureToken: true
        });

        const uid = authResponse.data.localId;

        const userDoc = await admin.firestore().collection('usuarios').doc(uid).get();

        if (!userDoc.exists) {
            throw new Error("Perfil do usuário não encontrado no banco de dados.");
        }

        const dadosUsuario = userDoc.data();

        if (dadosUsuario.status !== 'ativo') {
            throw new Error("Usuário inativo ou não autorizado.");
        }

        
        const tokenValido = jwt.sign(
            { 
                uid: uid, 
                email: dadosUsuario.email, 
                role: dadosUsuario.role // 
            }, 
            JWT_SECRET,
            { expiresIn: '7d' } // Expira em 7 dias
        );

        return {
            token: tokenValido,
            usuario: {
                uid: uid,
                ...dadosUsuario
            }
        };

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message;
        
        if (errorMsg === 'INVALID_PASSWORD' || errorMsg === 'EMAIL_NOT_FOUND') {
            throw new Error("E-mail ou senha incorretos.");
        }
        
        console.error(`[AuthService] Erro no login: ${error.message}`);
        throw error;
    }
};

module.exports = { cadastrarUsuario, loginUsuario };