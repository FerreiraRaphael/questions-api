/**
 * @module models/index
 * @file Initialize Sequelize models Definitions.
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize').default;
const config = require('../config/config.js')[
  process.env.NODE_ENV || 'development'
];

const { DATABASE_URL } = process.env;
const basename = path.basename(__filename);
const db = {};
const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, config)
  : new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;
