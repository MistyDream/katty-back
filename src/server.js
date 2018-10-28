const Hapi = require('hapi');

const plugins = require('./plugins');
const swagger = require('./swagger');
const Nes = require('./websocket');

const routes = require('./routes');
// Read configuration file
const env = process.env.NODE_ENV || 'development';
const config = require('./config/general.js')[env];
const models = require('./models');

const validate = async (decoded) => {
  const user = await models.User.findById(decoded.id).then(result => result);
  if (user != null) {
    return { isValid: true };
  }
  return { isValid: false };
};

exports.deployment = async () => {
  // Server configuration
  const server = Hapi.server({
    port: process.env.PORT || config.server_port,
    host: '0.0.0.0',
    debug: { request: ['error'] },
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

  // Setup Nes websocket
  await Nes.webSocket(server);

  // add routes
  await server.route(routes);

  return server;
};
