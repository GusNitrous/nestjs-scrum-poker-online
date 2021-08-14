const BASE_URL = 'http://localhost:3000';
let inputRegister = null;
let inputRoomId = null;
let socket = null;

function register() {
	const userName = inputRegister.value;
	const requestData = {userName};
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestData) 
	};

	fetch(`${BASE_URL}/auth/register`, options).then(async (response) => {
		const result = await response.json();
		if (response.ok) {
			saveAuthData(result);
			console.log('auth_data', result);
			socket = initSocket(result);
		} else {
			alert('Ошибка регистрации!');
			console.log(result);
		}
	}).catch((err) => {
		alert('Ошибка запроса на регистрацию');
		console.log(err);
	});
}

function createRoom() {
	if (socket.connected) {
		socket.emit(CREATE_ROOM);
	} else {
		alert('Socket disconnected!');
	}
}

function joinRoom() {
	const roomId = inputRoomId.value;
	console.log('JOIN_ROOM', roomId);

	if (socket && socket.connected && roomId) {
		socket.emit(JOIN_ROOM, { roomId });
	} else {
		alert('Invalid connection or roomId');
	}
}

function onRoomCreated(data) {
	console.log(ROOM_CREATED, data);
}

function onRoomJoin(data) {
	console.log(JOINED_TO_ROOM, data);
}

function onUserJoin(data) {
	console.log(USER_JOINED, data);
}

function initSocket({jwtToken}) {
	const socket = io(BASE_URL, {
		auth: {
			token: jwtToken
		}
	});

	socket.on('connect', () => {
		console.log('Connected');
	});

	socket.on('disconnect', () => {
		console.log('Disconnected');
	});

	socket.on('exception', (err) => {
		console.log('exception', err);
		alert('WS Exception');
	});

	socket.on(ROOM_CREATED, onRoomCreated);
	socket.on(JOINED_TO_ROOM, onRoomJoin);
	socket.on(USER_JOINED, onUserJoin);

	return socket;
}

// @ts-ignore
document.addEventListener('DOMContentLoaded', async () => {
	inputRegister = document.getElementById('inputRegister');
	inputRoomId = document.getElementById('inputRoomId');
});