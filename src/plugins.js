const Sequelize = require('sequelize');
const pluginSequelize = require('hapi-sequelizejs');
const config = require('./config/dev.json');

// Database configuration
const sequelize = new Sequelize(config.db_name, config.db_username, config.db_password, {
  host: config.db_hostname,
  dialect: config.db_dialect,
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
];
