const itemService = require('../services/itemService');

const registrarNovoItem = async (req, res) => {
  try {
    // Pega o UID do usuário que foi injetado pelo authMiddleware
    const uidUsuario = req.user.uid; 
    const dadosItem = req.body;

    // Validação básica de entrada
    if (!dadosItem) {
      return res.status(400).json({ 
        error: 'Dados do item de descarte não fornecidos.' 
      });
    }

    const resultado = await itemService.registrarDescarte(uidUsuario, dadosItem);

    // Retorno de sucesso com o Token do QR Code
    return res.status(201).json({
      message: 'Descarte registrado com sucesso!',
      data: resultado
    });

  } catch (error) {
    console.error(`[ItemController] Erro: ${error.message}`);
    
    return res.status(500).json({ 
      error: 'Erro interno ao registrar o descarte. Tente novamente mais tarde.' 
    });
  }
};

module.exports = { registrarNovoItem };