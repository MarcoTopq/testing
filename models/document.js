'use strict'
const Sequelize = require('sequelize');
const User = require('../models/users');
const db = require('../bin/index')
const Document = db.define('m_document', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_card: {
    type: Sequelize.STRING,
    unique: true,
  },
  doc_file: {
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

Document.sync();

module.exports = Document;