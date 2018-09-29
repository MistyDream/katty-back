const Hapi = require('hapi');

const plugins = require('./plugins');
const routes = require('./routes').default;
// Read configuration file
const config = require('./config/dev.json');

exports.deployment = async () => {
  // Server configuration
  const server = Hapi.server({
    port: config.server_port,
    host: config.server_hostname,
  });

  // register plugins
  await server.register(plugins);

  // add routes
  server.route(routes);

  return server;
};
