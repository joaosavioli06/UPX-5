const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler'); // Utils

const register = async (req, res) => {
  try {
    const { nome, email, password, tipo_perfil } = req.body;

    if (!nome || !email || !password || !tipo_perfil) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const resultado = await authService.cadastrarUsuario(nome, email, password, tipo_perfil);

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      data: resultado
    });

  } catch (error) {
    // Tratamento de erros específicos do Firebase
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    
    return res.status(500).json({ error: 'Erro interno ao processar o cadastro.' });
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

module.exports = {register, login};