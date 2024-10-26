const permissions = require('./permissions.json');
const ranks = require('../ranks.json');
const { Room, getRoomByName } = require('../room.js');
const config = server.config;

function getKeyByValue(object, value) {
 	return Object.keys(object).find(key => object[key] === value);
};
function findPlayer(credentials) {
	// by game id
	let target = server.players.filter(plr => plr.id == credentials)[0];
	// by socket id
	if(isNaN(target) && credentials.length === 20) target = server.players.filter(plr => plr.sid == credentials)[0];
	// by nick
	else if(isNaN(target && !target)) target = server.players.filter(plr => plr.nick == credentials)[0];
	return target;
};

class Command {
	constructor(client, message) {
		this.socket = server.sockets.filter(socket => socket.id == client.sid)[0];
		this.author = client;
		this.message = message
		this.args = message.split(' ');
		this.cmd = this.args[0].replaceAll('/', '');
		this.args.shift();

		if(client.rank < permissions[this.cmd]) return;

		if(typeof this[this.cmd] == 'function') this[this.cmd](...this.args);
	};
	nick(nickname) {
		if(nickname.length > config.maxNicknameLength) return;
		this.author.nick = nickname || '';
		this.socket.emit('server', 'Your new nickname: ' + nickname);
	};
	rank(target) {
		if(target) {
			// target, send target's rank
			target = findPlayer(target);
			if(!target) this.socket.emit('server', 'No player was found!');
			else this.socket.emit('server', target.id + '\'s rank is: ' + target.rank);
		} else {
			// no target, send your rank
			this.socket.emit('server', 'Your current rank: ' + this.author.rank);
		};
	};
	adminlogin(login) {
		if(login == process.env.adminlogin) {
			this.author.rank = ranks.admin;
			this.socket.emit('server', 'Your new rank: admin');
		};
	};
	modlogin(login) {
		if(login == process.env.modlogin) {
			this.author.rank = ranks.moderator;
			this.socket.emit('server', 'Your new rank: moderator');
		};
	};
	kickall() {
		for(let i in server.sockets) {
			server.players = server.players.filter(plr => plr.sid == server.sockets[i]);
			server.sockets[i].disconnect();
		};
	};
	whois(target) {
		target = findPlayer(target);
		if(target) {
			this.socket.emit('server', `id: ${target}`);
		} else {
			this.socket.emit('server', 'No player was found');
		};
	};
	rooms() {
		let list = [];
		for(let i in server.rooms) {
			let room = server.rooms[i];
			list.push(`${room.name}`);
		};
		this.socket.emit('server', 'Rooms: ' + list.join(' | '));
	};
	mute(target) {
		target = findPlayer(target);
		if(target) {
			target.muted = true;
		};
	};
	display(disp) {
		let room = getRoomByName(this.author.room);
		room.display = disp;
		for(let i in room.players) server.sockets.filter(socket => socket.id == room.players[i].sid)[0].emit('display', getRoomByName(this.author.room).display);
	};
	cmdlist() {
		let cmds = this.filter(cmd => typeof cmd == 'function');
		this.socket.emit('server', cmds.join(', '));
	};
};

module.exports = Command;