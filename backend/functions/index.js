const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Inicializa o Firebase Admin com privilégios totais
admin.initializeApp();

const app = express();

// Middlewares Globais
app.use(cors({ origin: true })); // Permite que o app da Lívia acesse a API
app.use(express.json());

// Importação das Rotas
const authRoutes = require('./src/routes/authRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

// Definição dos prefixos das rotas
app.use('/auth', authRoutes);
app.use('/itens', itemRoutes);

// Exporta a API para o Firebase Functions
// O nome 'api' será parte da sua URL final (ex: .../api/auth/register)
exports.api = functions.region('southamerica-east1').https.onRequest(app);