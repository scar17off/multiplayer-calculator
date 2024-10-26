/**
 * Represents a room in the server.
 */
class Room {
  /**
   * Create a new Room.
   * @param {string} name - The name of the room.
   */
  constructor(name) {
    this.name = name;
    this.players = [];
    this.display = '';
    this.maxplrs = 20;
    this.owner = null;
    this.calctype = 'algebraic';
  }

  /**
   * Set the display for the room.
   * @param {string} newDisplay - The new display value.
   */
  setDisplay(newDisplay) {
    this.display = newDisplay;
  }

  /**
   * Set the owner of the room.
   * @param {Object} player - The player object to set as owner.
   */
  setOwner(player) {
    this.owner = player;
  }

  /**
   * Set the calculation type for the room.
   * @param {string} type - The calculation type to set.
   */
  setCalcType(type) {
    this.calctype = type;
  }
}

/**
 * Get a room by its name.
 * @param {string} name - The name of the room to find.
 * @returns {Room|boolean} The room object if found, false otherwise.
 */
function getRoomByName(name) {
  if (server.rooms.filter(r => r.name == name).length > 0) return server.rooms.filter(r => r.name == name)[0];
  else return false;
}

module.exports = {
  Room: Room,
  getRoomByName: getRoomByName
};