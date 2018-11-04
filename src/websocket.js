const Nes = require('nes');
const Moment = require('moment');

const queue = [];
const rooms = [];

const getRoomName = async () => {
  const room = await Math.random().toString(36).substr(2);

  return rooms.find(element => element.name === room) ? getRoomName() : room;
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
    const room = await {
      name: await getRoomName(),
      users: [socket, queueSocket],
    };
    await rooms.push(room);

    const pathname = `/room/${room.name}`;
    await socket.publish('/match', { type: 'room', path: pathname });
    await queueSocket.publish('/match', { type: 'room', path: pathname });
  } else {
    await queue.push(socket);
  }
};

exports.webSocket = async (server) => {
  // Setup Nes
  await server.register({
    plugin: Nes,
    options: {
      heartbeat: {
        interval: 5001,
        timeout: 5000,
      },
      onMessage: (socket, message) => {
        const msg = message;
        msg.user = {
          id: socket.auth.credentials.id,
          name: socket.auth.credentials.username,
        };
        msg.sendAt = Moment();
        server.publish(message.path, msg);
        return message;
      },
    },
  });

  server.subscription('/match', {
    onSubscribe: async (socket) => {
      await queueAdd(socket);
    },
    onUnsubscribe: async (socket) => {
      const index = queue.indexOf(socket);
      if (index >= 0) {
        queue.splice(index, 1);
      }
    },
  });

  server.subscription('/room/{slug}', {
    onUnsubscribe: async (socket, path, params) => {
      const room = rooms.find(element => element.name === path.slice(6));
      if (room) {
        rooms.splice(rooms.indexOf(room), 1);
        const { users } = room;
        const otherSocket = users.find(
          element => element.auth.credentials.id !== socket.auth.credentials.id,
        );

        await otherSocket.revoke(path, { message: 'A user has quit the channel' });
      }
    },
  });
};
