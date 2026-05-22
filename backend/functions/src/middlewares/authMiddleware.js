const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

/**
 * Verifica se o Token enviado pelo Mobile é válido
 */
const validateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET; // Usa a mesma chave do seu .env

        
        const decoded = jwt.verify(token, JWT_SECRET);

        // Injeta os dados mapeados no req.user para o próximo middleware (validateRole) ler
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
            role: decoded.role // Aqui o "morador" é liberado
        };

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