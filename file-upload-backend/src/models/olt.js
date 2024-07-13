// src/models/olt.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Olt = sequelize.define('Olt', {
  OnuIndex: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Mode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  AuthInfo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  State: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Olt;