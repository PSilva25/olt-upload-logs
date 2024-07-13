// src/config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://dev_user:dev_password@localhost:5432/dev_db', {
  dialect: 'postgres',
});

module.exports = sequelize;