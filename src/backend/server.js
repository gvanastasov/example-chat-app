const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initSocket } = require('./config/socket');
const { db } = require('./config/db');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

db.serialize(() => {
  logger.info('Database initialized');
});

initSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});