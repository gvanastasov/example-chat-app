const chatService = require('../services/chatService');
const messages = require('../config/messages');

const handleCreateChat = async (_io, socket, data) => {
  try {
    // todo: validate input
    const chatId = await chatService.create(data.name, data.createdBy);
    socket.emit('message', { type: messages.out.CHAT_CREATE_ACK, data: { id: chatId } });
  } catch (err) {
    // todo: handle error
  }
}

const handleJoinRoom = async (socket, roomId) => {
  socket.join(roomId);

  // todo: use logger
  console.log(`User ${socket.id} joined room ${roomId}`);

  try {
    const history = await chatService.getHistory(roomId);

    // todo: create payload strategy
    socket.emit('chat_history', history);
  } catch (err) {
    // todo: use logger
    // todo: emit error to client (and use payload strategy)
    console.error(err);
  }
}

const handleChatMessage = async (io, roomId, user, text) => {
  try {
    const message = await chatService.saveMessage(roomId, user, text);

    // todo: create payload strategy
    io.to(roomId).emit('chat_message', message);
  } catch (err) {
    // todo: use logger
    // todo: emit error to client (and use payload strategy)
    console.log('Error saving message:', err);
  }
}

module.exports = {
  handleCreateRoom: handleCreateChat,
  handleJoinRoom,
  handleChatMessage,
};

// module.exports = (io, socket) => {
//   socket.on('join_room', (roomId) => {
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room ${roomId}`);

//     // todo: move to service
//     db.all(
//       `SELECT user, text, timestamp FROM messages WHERE roomId = ? ORDER BY timestamp ASC`,
//       [roomId],
//       (err, rows) => {
//         if (err) {
//           // todo: replace with logger
//           // todo: emit error to client
//           console.error(err);
//         } else {
//           socket.emit('chat_history', rows);
//         }
//       }
//     );
//   });

//   socket.on('chat_message', (data) => {
//     const { roomId, user, text } = data;
//     const sanitizedText = sanitize(text);

//     // todo: move to service
//     db.run(
//       `INSERT INTO messages (roomId, user, text) VALUES (?, ?, ?)`,
//       [roomId, user, sanitizedText],
//       (err) => {
//         if (err) {
//           // todo: replace with logger
//           // todo: emit error to client
//           console.error(err);
//         } else {
//           io.to(roomId).emit('chat_message', {
//             user,
//             text: sanitizedText,
//             timestamp: new Date().toISOString(),
//           });
//         }
//       }
//     );
//   });
// };
