class Player {
  constructor(socket) {
    this.x = 0;
    this.y = 0;
    this.rank = 0;
    this.nick = '';
    this.color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.muted = false;
    this.id = server.lastid;
    this.sid = socket.id;
    this.room = socket.handshake.query.room || 'lobby';
    server.lastid++;
  };
};

module.exports = Player;