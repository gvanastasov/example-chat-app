const { db } = require('../config/db');
const sanitize = require('../middleware/sanitize');

const create = (name, createdBy) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO chats (name, created_by) VALUES (?, ?)`,
      [name, createdBy],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

const get = (chatId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM chats WHERE id = ?`,
      [chatId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
};

const getHistory = (roomId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT user, text, timestamp FROM messages WHERE roomId = ? ORDER BY timestamp ASC`,
      [roomId],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

const saveMessage = (roomId, user, text) => {
  return new Promise((resolve, reject) => {
    const sanitizedText = sanitize(text);

    db.run(
      `INSERT INTO messages (roomId, user, text) VALUES (?, ?, ?)`,
      [roomId, user, sanitizedText],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            user,
            text: sanitizedText,
            timestamp: new Date().toISOString(),
          });
        }
      }
    );
  });
};

module.exports = {
  get,
  create,
  getHistory,
  saveMessage,
};
