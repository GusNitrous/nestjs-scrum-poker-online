function saveAuthData(data) {
	sessionStorage.setItem('auth', JSON.stringify(data));
}

function getAuthData() {
	const authData = sessionStorage.getItem('auth');
	return !authData ? null : JSON.parse(authData);
}