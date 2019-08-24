'use strict'
const Sequelize = require('sequelize');
const Building = require('../models/building');
const db = require('../bin/index')
const Room = db.define('m_room', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  mac_ble: {
    type: Sequelize.STRING,
  },
  obj: {
    type: Sequelize.STRING,
  },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  isDeleted: Sequelize.TINYINT,
});

Room.belongsTo(Building, {
    foreignKey: 'building_id',
    require: true
  });
  

Room.sync();

module.exports = Room;