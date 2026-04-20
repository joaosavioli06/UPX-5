const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { nome, email, password, tipo_perfil } = req.body;

    // Validação básica de entrada (Fail-fast)
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

module.exports = { register };