const Hapi = require('hapi');
const Nes = require('nes');

const plugins = require('./plugins');
const swagger = require('./swagger');

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
    routes: { cors: true },
  });

  // register plugins
  await server.register(plugins);

  // Setup swagger
  await server.register(swagger);

  // Setup Nes
  await server.register({
    plugin: Nes,
    options: {
      heartbeat: false, // remove this line
      onMessage: (socket, message) => {
        server.publish(message.path, message);
        return message;
      },
    },
  });

  // Authentication mode
  server.auth.strategy('jwt', 'jwt', {
    key: config.jwt_secret,
    validate,
    verifyOptions: { algorithms: ['HS256'] }, // pick a strong algorithm
  });
  server.auth.default('jwt');

  const queue = [];
  // const rooms = [];

  server.subscription('/match', {
    onSubscribe: async (socket, path, params) => {
      await queue.push(socket);
    },
    onUnsubscribe: async (socket, path, params) => {
      const index = await queue.findIndex(
        element => element.auth.credentials.username === socket.auth.credentials.username,
      );
      if (index !== undefined) {
        await queue.splice(index, 1);
      }
    },
  });

  server.subscription('/room/{slug}', {
    onUnsubscribe: async (socket, path, params) => {
      server.publish(path, { type: 'quit', message: 'A user has quit the channel' });
      queue.push(socket);
    },
  });

  setInterval(() => {
    if (queue.length >= 2) {
      const room = Math.random().toString(36).substr(2);
      queue[0].publish('/match', { type: 'room', path: `/room/${room}` });
      queue.shift();
      queue[0].publish('/match', { type: 'room', path: `/room/${room}` });
      queue.shift();
    }
  }, 500);

  // add routes
  await server.route(routes);

  return server;
};
