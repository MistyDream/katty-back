module.exports = {
  development: {
    username: 'katty',
    password: 'katty',
    database: 'katty',
    host: 'remychauvin.eu',
    dialect: 'mysql',
    jwt_secret: 'bisounours',
    server_port: 8000,
  },
  test: {
    username: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
    jwt_secret: 'bisounours',
    server_port: 8000,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    bisounours: process.env.JWT_SECRET,
    dialect: 'mysql',
    server_port: 8000,
  },
};
