const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateToken, validateRole } = require('../middlewares/authMiddleware');

// Rota: Morador registra o descarte
router.post('/registrar', validateToken, validateRole(['morador', 'sindico']), itemController.registrarNovoItem);

// Rota: Usuário vê seu próprio histórico
router.get('/meus-itens', validateToken, itemController.listarItensPorUsuario);

module.exports = router;