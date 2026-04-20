const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Cadastro de Usuário
// POST /auth/register
router.post('/register', authController.register);

module.exports = router;