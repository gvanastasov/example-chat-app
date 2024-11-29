const { Server } = require('socket.io');
const chatController = require('../controllers/chatController');
const messages = require('./messages');

const handlers = {
  [messages.in.CHAT_CREATE]: chatController.handleCreateChat,
  [messages.in.CHAT_JOIN]: chatController.handleJoinRoom,
  [messages.in.CHAT_MESSAGE_SEND]: chatController.handleChatMessage,
};

// todo: move out of here
const INACTIVITY_TIMEOUT = 300000;
const getInactivityTimer = (socket) => setTimeout(() => {
  socket.disconnect();
  console.log(`User ${socket.id} disconnected due to inactivity.`);
}, INACTIVITY_TIMEOUT);
const resetInactivityTimer = (socket, timer) => {
  clearTimeout(timer);
  return getInactivityTimer(socket);
};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    chatController.handleConnected(socket);

    // todo: move out of here
    // let inactivityTimer = getInactivityTimer(socket);
    // socket.onAny(() => resetInactivityTimer(socket, inactivityTimer));

    socket.on('message', async ({ type, data }, callback) => {
      try {
        const handler = handlers[type];

        if (!handler) {
          // todo: use logger
          console.error(`Unknown message type: ${type}`);
          return;
        }

        const context = { io, socket, data, callback };

        await handler(context);
      } catch (err) {
        // todo: use logger
        console.error('Failed to process message:', err);
      }
    });

    socket.on('disconnect', () => {
      // todo: use logger
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket, messages };