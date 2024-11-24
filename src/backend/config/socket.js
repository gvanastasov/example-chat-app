const { Server } = require('socket.io');
const chatController = require('../controllers/chatController');
const userController = require('../controllers/userController');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    chatController(io, socket);
    userController(io, socket);
  });
};

module.exports = { initSocket };