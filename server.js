require('dotenv').config();
const app = require('./app');
const logger = require('./src/api/utils/logger');

const PORT = process.env.PORT || 3000;
const db = require('./src/models/index');

const env = process.env.NODE_ENV;

const config = require('./config/db.config')[env];

db.sequelize.authenticate().then(() => {
  logger.info(`env: ${env}`);
  logger.info(`Host: ${config.host}`);
  logger.info(`Name: ${config.database}`);
  logger.info(`User: ${config.username}`);
  logger.info(`Port: ${config.port}`);
  logger.info('Connection has been established successfully.');
});

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});
