import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import './App.css';
import SimpleCalculator from './components/SimpleCalculator';
import AlgebraicCalculator from './components/AlgebraicCalculator';

function App() {
	const [display, setDisplay] = useState('0');
	const [chatMessages, setChatMessages] = useState([]);
	const [players, setPlayers] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [calculatorType, setCalculatorType] = useState('algebraic');
	const canvasRef = useRef(null);
	const chatRef = useRef(null);
	const socketRef = useRef(null);
	const cursorImgRef = useRef(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (!urlParams.get('room')) {
			window.location.href = '/?room=lobby';
		}

		socketRef.current = io('http://localhost:443', {
			query: Object.fromEntries(urlParams)
		});

		socketRef.current.on('connect', () => {
			console.log('Connected!');
			['adminlogin', 'modlogin', 'nick'].forEach(key => {
				const value = localStorage.getItem(key);
				if (value) {
					socketRef.current.emit('chat', `/${key} ${value}`);
				}
			});
		});

		socketRef.current.on('disconnect', () => {
			console.log('Disconnected!');
		});

		socketRef.current.on('server', (msg) => {
			console.log('Received server message:', msg);
			addChatMessage(msg, 'server');
		});

		socketRef.current.on('chat', (player, msg) => {
			addChatMessage(`${player.nick || player.id}: ${msg}`, player.rank);
		});

		socketRef.current.on('players', (newPlayers) => {
			setPlayers(newPlayers);
			drawPlayers(newPlayers);
		});

		socketRef.current.on('display', (newDisplay) => {
			setDisplay(newDisplay);
		});

		socketRef.current.on('calculatorType', (type) => {
			console.log('Received calculatorType event:', type);
			setCalculatorType(prevType => {
				console.log(`Updating calculator type from ${prevType} to ${type}`);
				return type;
			});
		});

		const cursorImg = new Image();
		cursorImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAeCAMAAADw+3VaAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAABToCx4AAAAD3RSTlMAAwgRDRgrJB8bPzUwFTrd3IvVAAAAlklEQVQoz63RWxKDIBBE0cAMCD7i7H+1ma7CtAH+Yn+eC5aWrycXfDO1gE3cNMYrkKOdJtqHENXO0w6EwT2kFugCZ+icoXMG+hjoDPRJoDMM3j6Q7nBN/ALd1nV9b3tequjNDbjnvJR0d9twtJRanfkcy36ypkNElO+jVha/D8LC1yXhLASDwhHk538xaCTTMTLX9J99AIoYCnDqxvLgAAAAAElFTkSuQmCC';
		cursorImg.onload = () => {
			cursorImgRef.current = cursorImg;
		};

		const handleResize = () => {
			const canvas = canvasRef.current;
			if (canvas) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
				drawPlayers(players);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
			socketRef.current.disconnect();
		};
	}, []);

	useEffect(() => {
		const handleMouseMove = (e) => {
			const xPercent = e.clientX / window.innerWidth;
			const yPercent = e.clientY / window.innerHeight;
			socketRef.current.emit('pos', xPercent, yPercent);
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	const addChatMessage = (msg, type) => {
		setChatMessages(prev => [...prev, { msg, type }]);
	};

	const drawPlayers = (players) => {
		const canvas = canvasRef.current;
		if (!canvas || !cursorImgRef.current) return;

		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const cursorImg = cursorImgRef.current;

		players.forEach(plr => {
			if (plr.sid === socketRef.current.id) return;

			const x = Math.round(plr.x * canvas.width);
			const y = Math.round(plr.y * canvas.height);

			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			ctx.drawImage(cursorImg, x, y, cursorImg.width, cursorImg.height);

			ctx.imageSmoothingEnabled = false;

			ctx.textAlign = 'center';
			ctx.font = "14px serif";
			ctx.fillStyle = "#ffffff";
			ctx.fillText(`${plr.nick ? `${plr.nick} (${plr.id})` : plr.id}`, x + cursorImg.width / 2, y + cursorImg.height + 15);
		});
	};

	const handleChatSubmit = (e) => {
		e.preventDefault();
		if (inputValue.trim() === '') return;

		console.log('Sending chat message:', inputValue);
		socketRef.current.emit('chat', inputValue);
		setInputValue('');
	};

	const handleKeyPress = (key) => {
		socketRef.current.emit('key', key);
	};

	useEffect(() => {
		console.log('Calculator type state changed to:', calculatorType);
	}, [calculatorType]);

	const renderCalculator = useCallback(() => {
		const props = { display, handleKeyPress };
		console.log('Rendering calculator of type:', calculatorType);
		return calculatorType === 'simple'
			? <SimpleCalculator {...props} />
			: <AlgebraicCalculator {...props} />;
	}, [calculatorType, display, handleKeyPress]);

	return (
		<div className="App">
			<canvas ref={canvasRef} className="game-canvas" />
			<div className="topbar">
				{players.map(player => (
					<div
						key={player.sid}
						className={`player-tag ${player.isOwner ? 'owner' : ''}`}
						style={{
							backgroundColor: `rgb(${player.color.join(',')})`,
							outline: player.isOwner ? '3px solid yellow' : 'none'
						}}
					>
						{player.nick || player.id}
					</div>
				))}
			</div>
			<div className="chat-container">
				<div className="chat-messages" ref={chatRef}>
					{chatMessages.map((msg, index) => (
						<div key={index} className={`chat-message ${msg.type}`}>
							{msg.msg}
						</div>
					))}
				</div>
				<form onSubmit={handleChatSubmit}>
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Send message..."
					/>
				</form>
			</div>
			{renderCalculator()}
			<div className="player-count">Players: {players.length}</div>
		</div>
	);
}

export default App;