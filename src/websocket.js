const Nes = require('nes');

const queue = [];
const rooms = [];

const getRoomName = async () => {
  const room = await Math.random().toString(36).substr(2);

  let exist = false;
  for (let i = 0; i < rooms.length; i += 1) {
    if (rooms.find(element => element === room)) {
      exist = true;
      break;
    }
  }

  return exist ? getRoomName() : room;
};

const getMatch = (socket) => {
  for (let i = 0; i < queue.length; i += 1) {
    if (!(queue[i].auth.credentials.id === socket.auth.credentials.id)) {
      const element = queue[i];
      queue.splice(i, 1);

      return element;
    }
  }

  return null;
};

const queueAdd = async (socket) => {
  const queueSocket = await getMatch(socket);

  if (queueSocket) {
    let room = await getRoomName();
    await rooms.push(room);

    room = `/room/${room}`;
    await socket.send({ type: 'room', path: room });
    await queueSocket.send({ type: 'room', path: room });
  } else {
    await queue.push(socket);
  }
};

exports.webSocket = async (server) => {
  // Setup Nes
  await server.register({
    plugin: Nes,
    options: {
      heartbeat: false, // remove this line
      onConnection: async (socket) => {
        // const socketAlreadyConnect = await queue.find(element => element.auth.credentials.id === socket.auth.credentials.id);
      },
      onMessage: (socket, message) => {
        server.publish(message.path, message);
        return message;
      },
    },
  });

  server.subscription('/match', {
    onSubscribe: async (socket, path, params) => {
      await queueAdd(socket);
    },
  });

  server.subscription('/room/{slug}', {
    filter: (path, message, options) => {
      console.log(options.credentials);
      return true;
    },
    onUnsubscribe: async (socket, path, params) => {
      await server.publish(path, { type: 'quit', message: 'A user has quit the channel' });
      // todo : test
      await console.log(path.slice('/room/'.length));
      const index = queue.find(element => element === path.slice('/room/'.length));
      if (index !== undefined) {
        await rooms.splice(index, 1);
      }
      queue[0].room = '';
      await queueAdd(socket);
    },
  });
};
