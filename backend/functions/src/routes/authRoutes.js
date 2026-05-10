const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Cadastro de Usuário
router.post('/register', authController.register);
// Rota de Login de Usuário
router.post('/login', authController.login); 
// Nova linha para checar existência de email/cpf/telefone
router.post('/check', authController.checkExistence); 

module.exports = router;