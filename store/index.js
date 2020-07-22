import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		forcedLogin: true,
		hasLogin: false,
		userName: "",
		token:"",
		expireTime: "",
		scanTimes: 0, //大于1时 不另行增加scan
		userInfo: {}
	},
	mutations: {
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
		},
		setToken(state,token) {
			state.token = token
		},
		setScanTimes(state,times) {
			state.scanTimes=times
		},
		setUserInfo(state,info) {
			state.userInfo=info
		},
		setExpireTime(state,expireTime) {
			state.expireTime = expireTime
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
			state.token = "";
		}
	}
})

export default store
