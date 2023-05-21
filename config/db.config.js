module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tasks',
    host: process.env.DB_URL || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
  },
};
