const Sequelize = require('sequelize');
const db = require('../bin/index')
const User = require('../models/users');
const Credit = db.define('m_credit', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  total: {
    type: Sequelize.INTEGER,
  },
  payment: {
    type: Sequelize.INTEGER,
  },
  month: {
    type: Sequelize.INTEGER,
  },
  due_date: {
    type: Sequelize.INTEGER,
  },
  arrears: {
    type: Sequelize.INTEGER,
  },
  createdAt: Sequelize.TIME,
  updatedAt: Sequelize.TIME,
  isDeleted: Sequelize.BOOLEAN,
}, {
  paranoid: true,
  timestamps: true,
});

Credit.belongsTo(User, {
  foreignKey: 'user_id',
  require: true
});

Credit.sync();

module.exports = Credit;