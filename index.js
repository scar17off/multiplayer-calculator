process.on('uncaughtException', (ex) => {});

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Room, getRoomByName } = require('./server/room.js');

global.server = {
	express: app,
	io: io,
	players: [],
	sockets: [],
	lastid: 1,
	rooms: [new Room('lobby')],
	config: require('./config.json')
};

require('./server/listening/express.js');
require('./server/listening/io.js');

server.listen(8080);