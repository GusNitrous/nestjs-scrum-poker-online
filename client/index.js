document.addEventListener('DOMContentLoaded', async () => {

const BASE_URL = 'http://localhost:3000';

let userId = null;

const inputRegister = document.getElementById('inputRegister');
const inputRoomId = document.getElementById('inputRoomId');



const btnRegister = document.getElementById('btnRegister');

const btnCreate = document.getElementById('btnCreateRoom');
const btnConnect = document.getElementById('btnConnectRoom');


const socket = io(BASE_URL, {
	auth: {
		token: jwtToken
	}
});

async function register() {
	const userName = inputRegister.value;
	const response = await fetch(`${BASE_URL}/auth/register`, {method: 'POST', body: {userName}});
	if (!response.ok) {
		const authData = await response.json();
		saveAuthData(authData);
	} else {
		alert('Ошибка регистрации!');
		console.log(response);
	}
}

function createRoom() {
	if (socket.connected) {
		socket.emit('CREATE_ROOM');
	}
}

function onRoomCreated(data) {
	console.log('CREATING_ROOM_ERROR', data);
}

function onRoomCreatedError(data) {
	console.log('CREATING_ROOM_ERROR', data);
}

function joinRoom() {
	const { userId, roomId } = {};
	console.log('JOIN_ROOM', { userId, roomId });
	socket.emit('JOIN_ROOM', { userId, roomId });
}

function onRoomJoin(data) {
	console.log('JOINED_TO_ROOM', data);
}

function onUserJoin(data) {
	console.log('USER_JOIN', data);
}

function onRoomJoinError(data) {
	console.log('ROOM_JOIN_ERROR', data);
}


btnConnect.addEventListener('click', function onClickConnect(e) {
	if (socket.connected && roomId) {
		console.log('joinRoom', roomId);
		
	}
});

// Default socket events

socket.on('connect', () => {
	console.log('Connected');
});

socket.on('disconnect', () => {
	console.log('Disconnected');
});

// Room socket events

socket.on('CREATING_ROOM_ERROR', (data) => {
	console.log('CREATING_ROOM_ERROR', data);
});

socket.on('ROOM_CREATED', (data) => {
	console.log('rROOM_CREATED', data);
});

socket.on('ROOM_JOIN', (data) => {
	console.log('ROOM_JOIN', data);
});

socket.on('EXCEPTION', (err) => {
	console.log('EXCEPTION', err);
});
});