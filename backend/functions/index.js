const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Inicialização
admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Importação das Rotas
const authRoutes = require('./src/routes/authRoutes');
const itemRoutes = require('./src/routes/itemRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const globalErrorHandler = require('./src/middlewares/errorMiddleware');

// Definição dos Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/itens', itemRoutes);
app.use('/api/admin', adminRoutes);

// Middleware de Erro 
app.use(globalErrorHandler);

exports.api = functions.https.onRequest(app);