const { sendError } = require('../utils/responseHandler');


 // Middleware central de tratamento de erros (Error Handler)

const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERRO CRÍTICO]: ${err.stack}`);

  // Se for um erro de autenticação do Firebase
  if (err.code && err.code.startsWith('auth/')) {
    return sendError(res, 'Erro na autenticação: ' + err.message, 401);
  }

  // Erro padrão
  return sendError(res, 'Ocorreu um erro interno no servidor.', 500);
};

module.exports = globalErrorHandler;