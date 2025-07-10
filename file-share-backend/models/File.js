// models/File.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const File = sequelize.define('File', {
  filename: DataTypes.STRING,
  path: DataTypes.STRING,
  mimetype: DataTypes.STRING,
  size: DataTypes.INTEGER
});

File.belongsTo(User, { foreignKey: 'userId' });
module.exports = File;
