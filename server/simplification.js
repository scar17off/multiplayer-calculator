const { getRoomByName } = require('./room.js');

function getSocketsInRoom(roomName) {
	let room = getRoomByName(roomName);
	let sockets = [];
	for(let i in room.players) {
		 sockets.push(server.sockets.filter(sock => sock.id == room.players[i].sid)[0]);
	};
	return sockets;
};

function getPlayersInRoom(roomName) {
	let room = getRoomByName(roomName);
	return room.players;
};

module.exports = {
	getSocketsInRoom: getSocketsInRoom,
	getPlayersInRoom: getPlayersInRoom
};
