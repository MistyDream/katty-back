const Server = require('./server');

async function start() {
  try {
    const server = await Server.deployment();
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    process.exit(1);
  }
}

start();
