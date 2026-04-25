const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { validateRole } = require('../middlewares/authMiddleware');

// Rota protegida: Apenas moradores
router.post('/registrar', validateRole(['morador', 'sindico']), itemController.registrarNovoItem);

module.exports = router;