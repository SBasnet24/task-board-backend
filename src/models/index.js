const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../config/db.config')[env];

const sequelize = new Sequelize(
  process.env.DB_NAME || dbConfig.database,
  process.env.DB_USERNAME || dbConfig.username,
  process.env.DB_PASSWORD || dbConfig.password,
  {
    dialect: dbConfig.dialect,
    host: process.env.DB_URL || dbConfig.host,
    port: dbConfig.port || 3306,
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Task = require('./Task')(sequelize, Sequelize);

module.exports = db;
