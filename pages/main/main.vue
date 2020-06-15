<template>
	<view class="inv-head">
		<u-tabs :list="list" :current="Inv" @change="changeTab"></u-tabs>
		<view class="" v-show="Inv == 0">
			<predo></predo>
		</view>
		<view class="" v-show="Inv == 1">
			<done></done>
		</view>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	import predo from '../../pages/main/predo'
	import done from '../../pages/main/done'
	var page;
	export default {
		components: {
			predo,
			done
		},
		data() {
			return {
				Inv: 0,
				borderColor: '#e4e7ed',
				align: 'center',
				areaList: [],
				list: [{
					name: '待收货清单'
				}, {
					name: '已收货清单'
				}],
			}
		},
		onLoad() {
			if (!this.hasLogin) {
				uni.showModal({
					title: '未登录',
					content: '您未登录，需要登录后才能继续',
					/**
					 * 如果需要强制登录，不显示取消按钮
					 */
					showCancel: !this.forcedLogin,
					success: (res) => {
						if (res.confirm) {
							/**
							 * 如果需要强制登录，使用reLaunch方式
							 */
							if (this.forcedLogin) {
								uni.reLaunch({
									url: '../login/login'
								});
							} else {
								uni.navigateTo({
									url: '../login/login'
								});
							}
						}
					}
				});
			}

		},



		methods: {
			changeTab(Inv) {
				this.Inv = Inv;
			},
			showScan() {

			}


		}
	}
</script>

<style>
	.inv-h-w {
		background-color: #FFFFFF;
		height: 30upx;
		display: flex;
		width: 100%;
	}

	.inv-head {
		width: 100%;
	}

	.inv-h {
		font-size: 10upx;
		flex: 1;
		text-align: center;
		color: #C9C9C9;
		height: 30upx;
		line-height: 30upx;
		width: 50%;
	}

	.inv-h {
		width: 10%;
	}

	.inv-h-se {
		color: #5BA7FF;
		border-bottom: 4upx solid #5BA7FF;
	}

	page {
		background-color: #F2F2F2;
	}
</style>
