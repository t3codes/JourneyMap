const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncDatabase } = require('./models');
const { testConnection } = require('./config/database');
const usuariosRoutes = require('./routes/usuariosRouters');
const paisRoutes = require('./routes/paisReouters');
const restCountriesRoutes = require('./routes/restCountriesRouters');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // Permitir todas as origens para desenvolvimento
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Fullstack funcionando!',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      login: '/api/usuarios/login',
      paises: '/api/paises',
      restCountries: '/api/rest-countries'
    }
  });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/paises', paisRoutes);
app.use('/api/rest-countries', restCountriesRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Função para inicializar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco
    await testConnection();
    
    // Sincronizar modelos
    await syncDatabase();
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 API disponível em: http://localhost:${PORT}`);
      console.log(`📚 Documentação: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais para encerramento gracioso
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});

// Inicializar servidor
startServer();

