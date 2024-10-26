const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const { Room } = require('./server/room.js');

global.server = {
  express: app,
  io: io,
  players: [],
  sockets: [],
  lastid: 1,
  rooms: [new Room('lobby')],
  config: require('./config.json')
};

require('./server/io.js')(io);

const port = process.env.PORT || 443;
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});