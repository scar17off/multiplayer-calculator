const Player = require('./client/Client.js');
const Simplification = require('./simplification.js');
const Command = require('./commands/commands.js');
const { Room, getRoomByName } = require('./room.js');
const calcTypes = require('./calctypes.json');

function initializeSocketIO(io) {
	io.on('connection', (socket) => {
		var player = new Player(socket);
		console.log(`Player ${player.nick} (${player.sid}) connected to room ${player.room}`);

		var room = getRoomByName(player.room);
		if(!room) {
			room = new Room(socket.handshake.query.room);
			server.rooms.push(room);
		}
		if(room.players.length === 0) {
			room.setOwner(player);
			player.isOwner = true;
		}
		if(room.maxplrs === room.players.length) socket.disconnect();
		
		server.sockets.push(socket);
		server.players.push(player);
		room.players.push(player);

		function sendPlayers() {
			let socks = Simplification.getSocketsInRoom(player.room);
			for(let i in socks) socks[i].emit('players', getRoomByName(player.room).players);
		};

		function sendDisplay() {
			let socks = Simplification.getSocketsInRoom(player.room);
			for(let i in socks) socks[i].emit('display', getRoomByName(player.room).display);
		};

		player.rank = 1;
		sendPlayers();
		sendDisplay();
		socket.emit('calculatorType', room.calctype);

		socket.on('disconnect', () => {
			server.sockets = server.sockets.filter(sock => sock.id !== socket.id);
			server.players = server.players.filter(plr => plr.sid !== socket.id);
			room.players = room.players.filter(plr => plr.sid !== socket.id);
			if(room.players.length === 0) server.rooms = server.rooms.filter(r => r.name == player.room);
			sendPlayers();
		});
		socket.on('pos', (xPercent, yPercent) => {
			if(typeof xPercent !== 'number' || typeof yPercent !== 'number') return;
			if(xPercent < 0 || xPercent > 1 || yPercent < 0 || yPercent > 1) return;
			player.x = xPercent;
			player.y = yPercent;
			sendPlayers();
		});
		socket.on('chat', msg => {
			if(typeof msg !== 'string') return;
			msg = msg.trimLeft().trimRight().replaceAll('\n', '');
			if(player.muted) return;
			if(msg.startsWith('/')) {
				console.log('Received command:', msg);
				new Command(player, msg, socket, io);  // Pass socket and io to Command
			} else {
				console.log('Emitting chat message:', msg);
				io.to(player.room).emit('chat', player, msg);
			}
		});
		socket.on('key', key => {
			console.log(`Received key: ${key}, Calculator type: ${room.calctype}`);
			if(typeof key !== 'string') return;
			let keys = calcTypes[room.calctype];
			if(!keys.includes(key)) {
				console.log(`Key ${key} not found in allowed keys for ${room.calctype}`);
				return;
			}
			
			console.log(`Processing key: ${key}, Current display: ${room.display}`);
			
			const functions = ['sin', 'cos', 'tan', 'log', 'sqrt'];
			
			switch(key) {
				case 'AC':
					console.log('Clearing display');
					room.setDisplay('0');
					break;
				case 'DEL':
					console.log('Deleting last character');
					if(room.display.length > 1) {
						room.setDisplay(room.display.slice(0, -1));
					} else {
						room.setDisplay('0');
					}
					break;
				case '=':
					if(room.display.endsWith('-') || room.display.endsWith('+') || 
					   room.display.endsWith('*') || room.display.endsWith('/') || 
					   room.display.endsWith('.')) return;
					try {
						console.log(`Evaluating: ${room.display}`);
						let result = evaluateExpression(room.display);
						room.setDisplay(result.toString());
					} catch (error) {
						console.log(`Evaluation error: ${error}`);
						room.setDisplay('Error');
					}
					break;
				default:
					console.log(`Appending key: ${key}`);
					if(room.display === '0' && (functions.includes(key) || !isNaN(key))) {
						room.setDisplay(key);
					} else if(functions.includes(key) && calcTypes[room.calctype].includes(key)) {
						room.setDisplay(room.display + key + '(');
					} else {
						room.setDisplay(room.display + key);
					}
			}
			console.log(`New display: ${room.display}`);
			sendDisplay();
		});

		// Update this event listener for the calc command
		socket.on('calc', (type) => {
			console.log(`Received calc command with type: ${type}`);
			if (player.isOwner && ['simple', 'algebraic'].includes(type)) {
				room.setCalcType(type);
				console.log(`Emitting calculatorType event with type: ${type}`);
				io.to(player.room).emit('calculatorType', type);
				io.to(player.room).emit('server', `Calculator type changed to ${type}`);
				console.log(`Calculator type changed to ${type} for room ${player.room}`);
			} else {
				console.log('Player is not owner or invalid calculator type');
				socket.emit('server', 'You must be the room owner to change the calculator type.');
			}
		});
	});

	return io;
}

function evaluateExpression(expression) {
	// Replace 'x' and 'y' with some default values or throw an error
	expression = expression.replace(/x/g, '0').replace(/y/g, '0');

	// Handle functions
	expression = expression.replace(/sin\(/g, 'Math.sin(')
							   .replace(/cos\(/g, 'Math.cos(')
							   .replace(/tan\(/g, 'Math.tan(')
							   .replace(/log\(/g, 'Math.log(')
							   .replace(/sqrt\(/g, 'Math.sqrt(');

	// Handle functions without parentheses
	expression = expression.replace(/(\d+(?:\.\d+)?)\s*(sin|cos|tan|log|sqrt)\s*(\d+(?:\.\d+)?)/g, '$1 * Math.$2($3)')
						   .replace(/(sin|cos|tan|log|sqrt)(\d+(?:\.\d+)?)/g, 'Math.$1($2)');

	// Handle ^ operator
	expression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');

	console.log(`Evaluating expression: ${expression}`);
	return eval(expression);
}

module.exports = initializeSocketIO;
