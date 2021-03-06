// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const SCM_TOKEN = 'scm_token';

const getUsers = function() {
	let ret = '';
	ret = uni.getStorageSync(USERS_KEY);
	if (!ret) {
		ret = '[]';
	}
	return JSON.parse(ret);
}

const addUser = function(userInfo) {
	let users = getUsers();
	users.push({
		account: userInfo.account,
		password: userInfo.password
	});
	uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}
const getToken = function() {
	let ret = '';
	ret = uni.getStorageSync(SCM_TOKEN);
	if (!ret) {
		ret = '';
	}
	return ret;
}

const addToken = function(token) {
	uni.setStorageSync(SCM_TOKEN, token);
}

export default {
	getUsers,
	addUser,
	getToken,
	addToken
}
