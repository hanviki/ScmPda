import store from '../store'

function formatDate(value) {
	var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear().toString();
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString();
	var D = date.getDate() <10 ? ('0' + date.getDate().toString()) : date.getDate().toString(); 
	var h = date.getHours() < 10 ? ('0' + date.getHours().toString()) : date.getHours().toString();
	var m = date.getMinutes() < 10 ? ('0' + date.getMinutes().toString()) : date.getMinutes().toString();
	var s = date.getSeconds() < 10 ? ('0' + date.getSeconds().toString()) : date.getSeconds().toString();
	let now = Y + M + D + h + m + s;
	if (now > value.toString()) {
		return true;
	} else {
		return false;
	}
}

// 定义基础请求路径(后端服务器地址)
const baseRequest = (opts, data) => {
	const baseUrl = 'http://192.168.65.125:1022/'; //此为测试地址,并非真实地址
	let baseDefaultOpts = {
		url: baseUrl + opts.url,
		// 请求接口地址
		data: data,
		// 传入请求参数
		method: opts.method,
		// 配置请求类型
		header: opts.method == 'get' ? {
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		// 配置请求头
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.request(baseDefaultOpts).then(
			(res) => {
				console.info("resolve:" + res)
				switch (res[1].statusCode) {
					case 404:
						uni.showToast({
							icon: 'none',
							title: '很抱歉，资源未找到',
							duration: 2000
						})
						break
					case 403:
					case 401:
						uni.showToast({
							title: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
							duration: 2000
						})
						break
					case 500:
						uni.showToast({
							title: res[1].data.message,
							duration: 2000
						})
						break
					default:
						resolve(res[1])
						break
				}
			}
		).catch(
			(response) => {
				console.info("reject:" + response)
				reject(response)
			}
		)
	})
	return promise
};
//带Token请求
const TokenRequest = (opts, data) => {
	const baseUrl = 'http://192.168.65.125:1022/'; //此为测试地址,并非真实地址



	//此token是登录成功后后台返回保存在storage中的
	let DefaultOpts = {
		url: baseUrl + opts.url,
		data: data,
		method: opts.method,
		header: opts.method == 'get' ? {
			'Authentication': store.state.token,
			'X-Requested-With': 'XMLHttpRequest',
			"Accept": "application/json",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'Authentication': store.state.token,
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		console.info("cc" + store.state.expireTime)
		// 让token早10秒种过期，提升体验
		if (store.state.expireTime == '' || formatDate(store.state.expireTime)) {
			
			uni.showModal({
				title: '登录过期',
				content: '您登录过期，需要重新登录后才能继续',
				/**
				 * 如果需要强制登录，不显示取消按钮
				 */
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: '../login/login'
						});
					}
				}
			});
			//reject(response)
		} else {
			uni.request(DefaultOpts).then(
				(res) => {
					switch (res.status) {
						case 404:
							uni.showToast({
								icon: 'none',
								title: '很抱歉，资源未找到',
								duration: 2000
							})
							break
						case 403:
						case 401:
							uni.showToast({
								title: '很抱歉，您无法访问该资源，可能是因为没有相应权限或者登录已失效',
								duration: 2000
							})
							break
						default:
							resolve(res)
							break
					}
				}

			).catch(
				(response) => {
					console.info(response)
					reject(response)
				}
			)
		}
	})
	return promise
}
export default {
	baseRequest, //不带token
	TokenRequest //scm 添加token的
}
