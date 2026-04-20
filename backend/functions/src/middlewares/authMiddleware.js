const admin = require('firebase-admin');

/**
 * Middleware para validar o token do Firebase e verificar o cargo (role).
 * Garante que apenas usuários autenticados e autorizados acessem a rota.
 */
const validateRole = (rolesPermitidos) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido ou inválido.' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      // Verifica se o token é válido e decodifica as Custom Claims
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Verifica se o cargo do usuário está na lista de permissões da rota
      if (!rolesPermitidos.includes(decodedToken.role)) {
        return res.status(403).json({ error: 'Acesso negado: Perfil insuficiente.' });
      }

      // Adiciona os dados do usuário na requisição para uso posterior
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return res.status(401).json({ error: 'Token expirado ou inválido.' });
    }
  };
};

module.exports = { validateRole };