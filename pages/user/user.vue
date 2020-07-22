<template>
	<view class="content">
		<view style="text-align: center; margin-bottom: 10rpx;">{{userInfo.role}}</view>
		<view style="text-align: center;margin-bottom: 10rpx;">{{userInfo.username}}</view>
		<view style="text-align: center;margin-bottom: 10rpx;">{{userInfo.realName}}</view>
		<view style="text-align: center;">{{userInfo.deptName}}</view>
		<view class="btn-row">
			<button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
			<button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		computed: {
			...mapState(['hasLogin', 'forcedLogin', 'userInfo'])
		},
		methods: {
			...mapMutations(['logout']),
			bindLogin() {
				uni.$off('scancodedate')
				uni.navigateTo({
					url: '../login/login',
				});
			},
			bindLogout() {
				uni.$off('scancodedate')
				this.logout();
				uni.navigateTo({
					url: '../login/login',
				});
				/**
				 * 如果需要强制登录跳转回登录页面
				 
				if (this.forcedLogin) {
					uni.reLaunch({
						url: '../login/login',
					});
				}*/
			}
		}
	}
</script>

<style>

</style>
