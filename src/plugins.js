const Sequelize = require('sequelize');

const pluginSequelize = require('hapi-sequelizejs');
const pluginAuthJWT = require('hapi-auth-jwt2');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/general.js')[env];

// Database configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = [
  // Sequelize ORM
  {
    plugin: pluginSequelize,
    options: [
      {
        name: 'katty', // identifier
        models: ['./models/**/*.js'], // paths/globs to model files
        sequelize, // sequelize instance
        sync: true, // sync models - default false
        forceSync: false, // force sync (drops tables) - default false
      },
    ],
  },
  // JWT authentication
  {
    plugin: pluginAuthJWT,
  },
];
