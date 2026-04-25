// Padroniza as respostas da API enviadas ao Mobile


// Para retornos de sucesso (Status 200, 201, etc)
const sendSuccess = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

// Para retornos de erro (Status 400, 401, 403, 404, 500)
const sendError = (res, error, status = 500) => {
  return res.status(status).json({
    success: false,
    error: error.message || error
  });
};

module.exports = { sendSuccess, sendError };