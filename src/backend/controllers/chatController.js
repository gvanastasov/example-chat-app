const chatService = require('../services/chatService');
const messages = require('../config/messages');
const logger = require('../utils/logger');

const handleConnected = async (socket) => {
  try {
    var chats = await chatService.getAll();
    socket.emit('message', { type: messages.out.CONNECT_SUCCESS, data: { chats } });

    logger.info(`User connected: ${socket.id}`);
  } catch (err) {
    logger.error(`Failed to get chats for user ${socket.id}. Error: ${err.message}`);
  }
};

const handleCreateChat = async ({ socket, data, callback }) => {
  try {
    // todo: validate input
    const chatId = await chatService.create(data.name, data.createdBy);

    callback({ success: true, id: chatId });

    socket.broadcast.emit('message', { type: messages.out.CHAT_CREATED, data: { id: chatId, name: data.name } });

    logger.info(`Chat created: ${data.name}`);
  } catch (err) {
    // todo: align error messages
    callback({ success: false, error: err.message });
    logger.error(err);
  }
}

const handleJoinRoom = async ({ socket, data, callback }) => {
  try {
    // todo: validate input
    var chat = await chatService.get(data.chatId);
    if (!chat) {
      // todo: use logger
      // todo: align error messages
      callback({ success: false, error: 'Chat not found' });
      console.error(`Chat not found: ${data.chatId}`);
      return;
    }
    socket.join(chat.id.toString());
    const history = await chatService.getHistory(chat.id);
    callback({ success: true, chat: { ...chat, history } });
    // todo: use logger
    console.log(`User ${socket.id} joined room ${chat.id}`);
  } catch (err) {
    // todo: align error messages
    callback({ success: false, error: err.message });
    // todo: use logger
    console.error(err);
  }
}

const handleChatMessage = async ({ socket, data, callback }) => {
  try {
    const { chatId, user, text } = data;
    const message = await chatService.saveMessage(chatId, user, text);

    callback({ success: true, message: { chatId, ...message } });
    
    socket.broadcast
      .to(chatId.toString())
      .emit('message', { type: messages.out.CHAT_MESSAGE_RECEIVED, data: { chatId, ...message } });

    // todo: use logger
    console.log(`Message saved: ${user}: ${text}`);
  } catch (err) {
    // todo: use logger
    // todo: emit error to client (and use payload strategy)
    console.log('Error saving message:', err);
  }
}

module.exports = {
  handleConnected,
  handleCreateChat,
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
