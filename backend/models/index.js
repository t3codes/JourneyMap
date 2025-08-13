const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');

// Sincronizar modelos com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true recria as tabelas
    console.log('✅ Modelos sincronizados com o banco de dados!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error);
  }
};

module.exports = {
  sequelize,
  Usuario,
  syncDatabase
};

