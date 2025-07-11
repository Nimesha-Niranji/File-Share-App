const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const File = sequelize.define('File', {
  filename: DataTypes.STRING,
  path: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER,

  // New fields for public sharing
  publicToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

File.belongsTo(User, { foreignKey: 'userId' });

module.exports = File;
