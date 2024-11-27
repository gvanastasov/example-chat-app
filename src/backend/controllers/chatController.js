const chatService = require('../services/chatService');
const messages = require('../config/messages');

const handleCreateChat = async (_io, socket, data) => {
  try {
    // todo: validate input
    const chatId = await chatService.create(data.name, data.createdBy);
    socket.emit('message', { type: messages.out.CHAT_CREATE_ACK, data: { id: chatId } });
    console.log(`Chat created: ${chatId}`);
  } catch (err) {
    // todo: handle error
  }
}

const handleJoinRoom = async (_io, socket, data) => {
  try {
    // todo: validate input
    var chat = await chatService.get(data.chatId);
    if (!chat) {
      // todo: emit error
      // todo: use logger
      console.error(`Chat not found: ${data.chatId}`);
      return;
    }

    socket.join(chat.id);
    const history = await chatService.getHistory(chat.id);
    socket.emit('message', { type: messages.out.CHAT_JOIN_SUCCESS, data: { id: chat.id, name: chat.name, history } });
    // todo: use logger
    console.log(`User ${socket.id} joined room ${data.chatId}`);
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
