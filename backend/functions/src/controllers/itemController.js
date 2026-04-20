const itemService = require('../services/itemService');

/**
 * Controller para gerenciar as requisições de itens de descarte.
 */
const registrarNovoItem = async (req, res) => {
  try {
    // Pegamos o UID do usuário que foi injetado pelo authMiddleware
    const uidUsuario = req.user.uid; 
    const dadosItem = req.body;

    // Validação básica de entrada (Fail-fast)
    // No projeto final, aqui você pode validar se 'fotos' é um array, etc.
    if (!dadosItem) {
      return res.status(400).json({ 
        error: 'Dados do item de descarte não fornecidos.' 
      });
    }

    // Chama o serviço para realizar a lógica pesada
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