var io = server.io;
const Player = require('../client/Client.js');
const Simplification = require('../simplification.js');
const Command = require('../commands/commands.js');
const { Room, getRoomByName } = require('../room.js');

io.on('connection', async socket => {
	var player = new Player(socket);

	var room = getRoomByName(player.room);
	if(room.maxplrs === room.players.length) socket.disconnect();
	if(!room) {
		server.rooms.push(new Room(socket.handshake.query.room));
		room.owner = player;
	};
	server.sockets.push(socket);
	server.players.push(player);
	room.players.push(player);

	async function sendPlayers() {
		let socks = await Simplification.getSocketsInRoom(player.room);
		for(let i in socks) socks[i].emit('players', getRoomByName(player.room).players);
	};
	async function sendDisplay() {
		let socks = await Simplification.getSocketsInRoom(player.room);
		for(let i in socks) socks[i].emit('display', getRoomByName(player.room).display);
	};

	player.rank = 1;
	sendPlayers();
	sendDisplay();
	socket.on('disconnect', () => {
    	server.sockets = server.sockets.filter(sock => sock.id !== socket.id);
    	server.players = server.players.filter(plr => plr.sid !== socket.id);
		room.players = room.players.filter(plr => plr.sid !== socket.id);
		if(room.players.length === 0) server.rooms = server.rooms.filter(r => r.name == player.room);
		sendPlayers();
  	});
	socket.on('pos', (x, y) => {
		if(typeof x !== 'number' || typeof y !== 'number') return;
		player.x = x;
		player.y = y;
		sendPlayers();
	});
	socket.on('chat', msg => {
		if(typeof msg !== 'string') return;
		msg = msg.trimLeft().trimRight().replaceAll('\n', '');
		if(player.muted) return;
		if(msg.startsWith('/')) {
			new Command(player, msg);
		} else io.local.emit('chat', player, msg);
	});
	socket.on('key', key => {
		if(typeof key !== 'string') return;
		let keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '=', '*', '/', '.', 'ac'];
		if(keys.indexOf(key) == -1) return;
		if(key == 'ac') {
			room.setDisplay('');
			sendDisplay();
			return;
		} else if(key == 'c') {
			room.setDisplay(room.display.substring(0, str.length - 1));
		} else if(key == '=') {
			if(room.display.endsWith('-')) return;
			if(room.display.endsWith('+')) return;
			if(room.display.endsWith('*')) return;
			if(room.display.endsWith('/')) return;
			if(room.display.endsWith('.')) return;
			room.setDisplay(eval(room.display).toString());
		} else room.setDisplay((room.display + key).toString());
		sendDisplay();
	});
});