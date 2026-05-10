const admin = require('firebase-admin');
const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Utils

const register = async (req, res) => {
  try {
    // 1. Captura todos os campos que o celular está enviando
    const { nome, email, password, tipo_perfil, codigoAcesso, userData } = req.body;

    // 2. Validação básica (nome, email, senha e perfil continuam obrigatórios)
    if (!nome || !email || !password || !tipo_perfil) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando (nome, email, senha ou perfil).' });
    }

    // 3. Chama o serviço passando os 6 argumentos na ordem correta
    const resultado = await authService.cadastrarUsuario(
      nome, 
      email, 
      password, 
      tipo_perfil, 
      codigoAcesso, 
      userData
    );

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      data: resultado
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }

    // Retorna a mensagem real do erro (ex: "Código de síndico inválido")
    return res.status(400).json({ error: error.message || 'Erro ao processar o cadastro.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // O serviço vai validar as credenciais
    const resultado = await authService.loginUsuario(email, password);
    
    res.status(200).json({
      message: "Login realizado com sucesso",
      token: resultado.token,
      usuario: resultado.usuario
    });
  } catch (error) {
    res.status(401).json({ error: "Credenciais inválidas ou erro no servidor." });
  }
};

const checkExistence = async (req, res) => {
  try {
    const { email, cpf, telefone } = req.body;
    let exists = false;
    let message = "";

    // 1. Checagem de E-mail (Authentication E no Firestore)
    if (email) {
      try {
        // Firebase Authentication
        await admin.auth().getUserByEmail(email);
        exists = true;
        message = "Este e-mail já está em uso na portaria do sistema.";
      } catch (authError) {
        const snapshot = await admin.firestore().collection('usuarios').where('email', '==', email).get();
        if (!snapshot.empty) {
          exists = true;
          message = "Este e-mail já está vinculado a um perfil no banco de dados.";
        }
      }
    } 
    
    // Checagem de CPF
    else if (cpf) {
      const snapshot = await admin.firestore().collection('usuarios').where('cpf', '==', cpf).get();
      if (!snapshot.empty) {
        exists = true;
        message = "Este CPF já está cadastrado.";
      }
    }

  else if (telefone) {
  
  const telefoneLimpo = telefone.replace(/\D/g, ''); 

  const snapshot = await admin.firestore().collection('usuarios').get();
  
  const existeDuplicado = snapshot.docs.some(doc => {
    const telBanco = doc.data().telefone || "";
    return telBanco.replace(/\D/g, '') === telefoneLimpo;
  });

  if (existeDuplicado) {
    exists = true;
    message = "Este telefone já está cadastrado.";
  }
}

    return res.status(200).json({ exists, message });
  } catch (error) {
    console.error('Erro na checagem:', error);
    return res.status(500).json({ error: 'Erro interno ao validar dados.' });
  }
};

module.exports = {register, login, checkExistence};