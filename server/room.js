class Room {
	constructor(name) {
		this.name = name;
		this.players = [];
		this.display = '';
		this.maxplrs = 20;
		this.owner = null;
		this.calctype = 'algebraic';
	};
	setDisplay(newDisplay) {
		this.display = newDisplay;
	};
	setOwner(player) {
		this.owner = player;
	};
	setCalcType(type) {
		this.calctype = type;
	};
};

function getRoomByName(name) {
	if(server.rooms.filter(r => r.name == name).length > 0) return server.rooms.filter(r => r.name == name)[0];
	else return false;
};

module.exports = {
	Room: Room,
	getRoomByName: getRoomByName
};
