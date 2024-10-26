// url parameters
let urlParams = {};
(window.onpopstate = function () {
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = window.location.search.substring(1);

    while (match = search.exec(query)) {
        if (decode(match[1]) in urlParams) {
            if (!Array.isArray(urlParams[decode(match[1])])) {
                urlParams[decode(match[1])] = [urlParams[decode(match[1])]];
            }
            urlParams[decode(match[1])].push(decode(match[2]));
        } else {
            urlParams[decode(match[1])] = decode(match[2]);
        }
    }
})();
if(typeof urlParams.room == 'undefined') location.href = 'https://multiplayercalculator.scar17off.repl.co/?room=lobby';
// init
var ws = io('wss://multiplayercalculator.scar17off.repl.co/', {
	query: urlParams
});
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
// public api
var MPC = {
	chat: {
		local: (msg, color) => {
			if(!color) color = colors['server'];
			let msget = document.createElement('label');
			msget.style.color = color;
			msget.innerText = `${msg}\n`;
			chatdiv.appendChild(msget);
		},
		send: (message) => ws.emit('chat', message)
	},
	presskey: (key) => {
    	ws.emit('key', key); 
	},
	move: (x, y) => ws.emit('pos', x, y),
	display: '0',
	players: {}
};
// cursor
let cursor = document.createElement('img');
cursor.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAMAAADw+3VaAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAABToCx4AAAAD3RSTlMAAwgRDRgrJB8bPzUwFTrd3IvVAAAAlklEQVQoz63RWxKDIBBE0cAMCD7i7H+1ma7CtAH+Yn+eC5aWrycXfDO1gE3cNMYrkKOdJtqHENXO0w6EwT2kFugCZ+icoXMG+hjoDPRJoDMM3j6Q7nBN/ALd1nV9b3tequjNDbjnvJR0d9twtJRanfkcy36ypkNElO+jVha/D8LC1yXhLASDwhHk538xaCTTMTLX9J99AIoYCnDqxvLgAAAAAElFTkSuQmCC';
document.head.appendChild(cursor);
// fullscreen
function fullscreen() {
    canvas.width = document.body.clientWidth;/* - 6;*/
    canvas.height = document.body.clientHeight;/* - 6;*/
    canvasW = canvas.width;
    canvasH = canvas.height;
};

fullscreen();
var chat = document.getElementById('chat');
var chatdiv = document.getElementById('chat-msgs');
document.addEventListener("mousemove", (mouse) => {
    MPC.move(mouse.clientX, mouse.clientY);
}, false);
var saveable = ['adminlogin', 'modlogin', 'nick'];
// on chat Enter
chat.addEventListener('keydown', (key) => {
	if(key.keyCode == 13) {
		if(chat.value.trimLeft().trimRight() == '') return; // check if the message is empty before sending
		ws.emit('chat', chat.value);

		let args = chat.value.split(' ');
		args[0] = args[0].replaceAll('/', '').trimRight().trimLeft();
		let cmd = args[0];
		args.shift();
		if(saveable.indexOf(cmd) !== -1) { // if it exists
			// save it
			localStorage[cmd] = args.join(' ');
		};
		chat.value = '';
 	};
});
ws.on('connect', () => {
	console.log('Connected!');
	// load localstorage variables (nickname, adminlogin, etc.)
	for(let i in saveable) {
		if(typeof localStorage[saveable[i]] !== 'undefined') ws.emit('chat', '/' + saveable[i] + ' ' + localStorage.getItem(saveable[i]));
	};
});
// handle server messages
ws.on('server', (msg) => {
	let msget = document.createElement('label');
	msget.style.color = colors['server'];
	msget.innerText = `${msg}\n`;
	chatdiv.appendChild(msget);
});
// chat requirements
let prefixes = { // by ranks
	0: '',
	1: '',
	2: '[BOT]',
	3: '(M)',
	4: '(A)'
};
let colors = {
	0: '',
	1: '#ffffff',
	2: '#15cae6',
	3: '#e6157d',
	4: '#e61515',
	'server': '#0fdbd1'
};
// handle messages from chat
function convert(elem) {
    let text = elem.innerText;
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var text1 = text.replace(exp, "<a href='$1'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    elem.innerHTML = text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
};
ws.on('chat', (player, msg) => {
	let author = player.id;
	if(player.nick !== '') author = player.nick;
	let prefix = prefixes[player.rank];
	let msget = document.createElement('label');
	msget.style.color = colors[player.rank];
	msget.innerText = `${prefix} ${author}: ${msg}\n`;
	chatdiv.appendChild(msget);
	chatdiv.scrollTo(0, chatdiv.scrollHeight);
  	convert(msget);
  	let asd = document.querySelectorAll('a[href$=".png"], a[href$=".jpg"], a[href$=".gif"]');
	for (let i = 0; i < asd.length; i++) asd[i].innerHTML = `<img style="max-width: 300px;" src="` + asd[i].href + `" />`;
});
ws.on('players', (players) => {
	context.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
	players.sort(function(a, b) {
    	var textA = a.nick.toUpperCase();
    	var textB = b.nick.toUpperCase();
    	return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});
	document.getElementById('players').innerText = 'Players: ' + players.length;
	MPC.players = players;

	let childs = document.getElementById('topbar').childNodes;
	let currentPlrList = [];
	for(let i in childs) {
		if(childs[i].childNodes) {
			if(childs[i].childNodes.length > 0) currentPlrList.push(childs[i].childNodes[0].innerText);
		};
	};
	
	for(let i in players) { // players
		let plr = players[i];
		if(plr.nick == '') plr.nick = plr.id;

		for(let i in currentPlrList) {
			if(!players[currentPlrList[i]] && document.getElementById('plr-' + plr.sid)) {
				document.getElementById('plr-' + plr.sid).remove();
			};
		};

		if(!document.getElementById('plr-' + plr.sid)) {
			let div = document.createElement('div');
			div.id = 'plr-' + plr.sid; // old: nick
			div.classList = 'plr';
			div.style['background-color'] = 'rgb(' + plr.color.join(', ') + ')';
			let label = document.createElement('label');
			label.classList = 'plrname';
			if(!currentPlrList[plr.nick]) label.innerText = plr.nick;
			label.title = `ID: ${plr.id}`;
			div.appendChild(label);
			document.getElementById('topbar').appendChild(div);
		};
		if(plr.sid == ws.id) continue;
		// id
        context.textAlign = 'center';
		context.font = "14px serif";
		context.fillStyle = "#ffffff";
		context.fillText(plr.id, plr.x, plr.y + 30);
		context.drawImage(cursor, plr.x, plr.y);
	};
});
ws.on('display', (display) => {
	document.getElementById('displayResult').value = display; // display
	MPC.display = display;
	document.getElementById("displayResult").scrollTo(document.getElementById("displayResult").scrollWidth, 0);
});