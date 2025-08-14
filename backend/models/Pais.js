const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Usuario = require('./Usuario'); // Relacionamento com o modelo Usuario

const Pais = sequelize.define('Pais', {
  nome_comum: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nome_oficial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  regiao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moeda: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capital: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  continente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_png: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link_googlemaps: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  populacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  official_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visited: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Se o usuário visitou o país ou não
  },
  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'paises',
  timestamps: true, // Cria os campos createdAt e updatedAt
});

// Definindo o relacionamento 1:N entre Pais e Usuario
Pais.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  onDelete: 'CASCADE', // Quando o usuário for deletado, seus países também serão
});
Usuario.hasMany(Pais, {
  foreignKey: 'usuarioId',
});

module.exports = Pais;
