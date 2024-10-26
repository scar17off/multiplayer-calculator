class Room {
	constructor(name) {
		this.name = name;
		this.players = [];
		this.display = '';
		this.maxplrs = 20;
		this.owner = null;
		this.calctype = 'simple';
	};
	setDisplay(newDisplay) {
		this.display = newDisplay;
	};
};

function getRoomByName(name) {
	if(server.rooms.filter(r => r.name == name)[0] !== []) return server.rooms.filter(r => r.name == name)[0];
	else return false;
};

module.exports = {
	Room: Room,
	getRoomByName: getRoomByName
};