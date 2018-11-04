const Server = require('./server');

async function start() {
  try {
    const server = await Server.deployment();
    await server.start();
  } catch (err) {
    throw err;
  }
}

start();
