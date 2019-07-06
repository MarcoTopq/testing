const Sequelize = require('sequelize');
const db = require('../bin/index')
const User = require('../models/users');
const Account = db.define('m_account', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bank_name: {
    type: Sequelize.STRING,
  },
  account_number: {
    type: Sequelize.STRING,
  },
  account_name: {
    type: Sequelize.STRING,
  },
  document_file: {
    type: Sequelize.STRING,
  },
  createdAt: Sequelize.TIME,
  updatedAt: Sequelize.TIME,
  isDeleted: Sequelize.BOOLEAN,
}, {
  paranoid: true,
  timestamps: true,
});

Account.belongsTo(User, {
  foreignKey: 'user_id',
  require: true
});

Account.sync();

module.exports = Account;