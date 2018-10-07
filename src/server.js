const Hapi = require('hapi');

const plugins = require('./plugins');
const swagger = require('./swagger');

const routes = require('./routes');
// Read configuration file
const env = process.env.NODE_ENV || 'development';
const config = require('./config/general.js')[env];

// TODO: Validation function
const validate = async (decoded, request) => {
  if (!people[decoded.id]) {
    return { isValid: false };
  }
  return { isValid: true };
};

exports.deployment = async () => {
  // Server configuration
  const server = Hapi.server({
    port: config.server_port,
    host: 'localhost',
  });

  // register plugins
  await server.register(plugins);

  // Setup swagger
  await server.register(swagger);

  // Authentication mode
  server.auth.strategy('jwt', 'jwt', {
    key: config.jwt_secret,
    validate,
    verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
  });
  server.auth.default('jwt');

  // add routes
  await server.route(routes);

  return server;
};
