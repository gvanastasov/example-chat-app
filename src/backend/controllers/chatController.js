const { db } = require('../config/db');
const sanitize = require('../middleware/sanitize');

module.exports = (io, socket) => {
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // todo: move to service
    db.all(
      `SELECT user, text, timestamp FROM messages WHERE roomId = ? ORDER BY timestamp ASC`,
      [roomId],
      (err, rows) => {
        if (err) {
          // todo: replace with logger
          // todo: emit error to client
          console.error(err);
        } else {
          socket.emit('chat_history', rows);
        }
      }
    );
  });

  socket.on('chat_message', (data) => {
    const { roomId, user, text } = data;
    const sanitizedText = sanitize(text);

    // todo: move to service
    db.run(
      `INSERT INTO messages (roomId, user, text) VALUES (?, ?, ?)`,
      [roomId, user, sanitizedText],
      (err) => {
        if (err) {
          // todo: replace with logger
          // todo: emit error to client
          console.error(err);
        } else {
          io.to(roomId).emit('chat_message', {
            user,
            text: sanitizedText,
            timestamp: new Date().toISOString(),
          });
        }
      }
    );
  });
};
