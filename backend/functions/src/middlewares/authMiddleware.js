const admin = require('firebase-admin');

/**
 * Verifica se o Token enviado pelo Mobile é válido
 */
const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou inválido.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Injeta os dados do usuário na requisição
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ error: 'Token expirado ou não autorizado.' });
  }
};

/**
 * Verifica se o usuário tem o perfil necessário (RBAC)
 */
const validateRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado: Perfil insuficiente.' });
    }
    next();
  };
};

module.exports = { validateToken, validateRole };