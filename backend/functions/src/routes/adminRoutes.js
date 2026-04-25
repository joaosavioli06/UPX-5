const express = require('express');
const router = express.Router();
const coletaController = require('../controllers/coletaController');
const { validateToken, validateRole } = require('../middlewares/authMiddleware');

// Usuários do tipo 'síndico' podem acessar ->
router.get('/pendentes', validateToken, validateRole(['sindico']), coletaController.listarColetasPendentes);
router.patch('/validar/:itemId', validateToken, validateRole(['sindico']), coletaController.validarColeta);

module.exports = router;