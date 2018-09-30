const Server = require('./server');

async function start() {
  try {
    const server = await Server.deployment();
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    throw err;
  }
}

start();
