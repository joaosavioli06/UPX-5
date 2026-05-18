const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController');
const { validateToken, validateRole } = require('../middlewares/authMiddleware');

router.post(
  '/analisar-imagem',
  validateToken,
  validateRole(['morador', 'sindico']),
  iaController.analisarImagem
);

router.post(
  '/analisar-e-registrar',
  validateToken,
  validateRole(['morador', 'sindico']),
  iaController.analisarERegistrar
);

module.exports = router;
