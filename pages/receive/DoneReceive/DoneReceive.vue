<template>
	<view class="inv-head">
		<u-tabs :list="list" :current="Inv" @change="changeTab"></u-tabs>
		<view class="" v-show="Inv == 0">
			<preInStock></preInStock>
		</view>
		<view class="" v-show="Inv == 1">
			<doneInStock></doneInStock>
		</view>
		<u-no-network></u-no-network>
	</view>
</template>

<script>
	
	import preInStock from  '../../../pages/main/preInStock'
	import doneInStock from  '../../../pages/main/doneInStock'
	
	export default {
		components: {
			preInStock, doneInStock
		},
		data() {
			return {
				Inv: 0,
				borderColor: '#e4e7ed',
				align: 'center',
				areaList: [],
				list: [{
					name: '待入库清单'
				}, {
					name: '已入库清单'
				}],
			}
		},
		onLoad() {
		},
		

		
		methods: {
			changeTab(Inv) {
				this.Inv = Inv;
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

	.inv-h-se {
		color: #5BA7FF;
		border-bottom: 4upx solid #5BA7FF;
	}

	page {
		background-color: #F2F2F2;
	}
</style>
