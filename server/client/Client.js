const Room = require('../room.js');

function randint(max) {
	return Math.floor(Math.random() * max);
};

class Player {
	constructor(socket) {
		this.x = 0;
		this.y = 0;
		this.rank = 0;
		this.nick = '';
		this.color = [randint(255), randint(255), randint(255)];
		this.muted = false;
		this.id = server.lastid;
		this.sid = socket.id;
		this.room = socket.handshake.query.room || 'lobby';
		server.lastid++;
	};
};

module.exports = Player;