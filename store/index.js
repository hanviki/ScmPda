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
		token:""
	},
	mutations: {
		login(state, userName) {
			state.userName = userName || '新用户';
			state.hasLogin = true;
		},
		setToken(state,token) {
			state.token = token
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
			state.token = "";
		}
	}
})

export default store
