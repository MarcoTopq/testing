'use strict'
const Sequelize = require('sequelize');
const User = require('../models/users');
const db = require('../bin/index')
const Building = db.define('m_building', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  address: {
    type: Sequelize.STRING,
  },
  obj: {
    type: Sequelize.STRING,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  isDeleted: Sequelize.TINYINT,
});

Document.belongsTo(User, {
  foreignKey: 'user_id',
  require: true
});

Building.sync();

module.exports = Building;