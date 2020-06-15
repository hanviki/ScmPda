<template>
	<view>
		<view class="end-title">
			　　<view @tap="change(0)">待收货清单</view>
			　<view @tap="change(1)">已收货清单</view>
		</view>
		<view class="end-cont" v-show="btnnum == 0">
			　　<view class="dataContent" v-for="(item,index) in unDolist" :key="index">
				<view class="titleRow">
					<text>{{item.txz01}}</text>
				</view>
				<view class="titleRow">
					<text>{{item.gMenge}}</text>
				</view>
				<view class="titleRow">
					<text>{{item.CreateTime}}</text>
				</view>
				<view class="titleRow">
					<text>{{item.id}}</text>
				</view>
			</view>
		</view>
		<view class="end-cont" v-show="btnnum == 1">
			　　1信息
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				btnnum: 0,
				unDolist: {}
			}
		},
		mounted() {
			this.getPlanList();
		},
		methods: {
		    getDate(type) {
				const date = new Date();
			
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
			
				if (type === 'start') {
					month = month - 1;
					if(month == -1 || month == 0)
					{
						month = 12;
						year = year - 1;
					}
				} 
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
			
				return `${year}-${month}-${day}`;
			},
			change(e) {
				this.btnnum = e
				console.log(this.btnnum)
			},
			getPlanList: function() {//第一次回去数据
				uni.showNavigationBarLoading();
				uni.request({
					url: 'viewSupplyplan/doneStatus/0',//待
					method:'POST',
					data:{
						eindt:getDate('start'),
						bedat:getDate()
					},
					success: function(res) {
						console.log(res.data.data)
						this.unDolist=res.data.data
						if(res.data.data.totalcount==res.data.data.response.length){
							uni.showToast({
								title: '已是最新',
								duration: 2000
							});
						}
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh();//得到数据后停止下拉刷新
					}
				});
				
			}
		}
	}
</script>

<style>
	/* 将三个内容view的display设置为none(隐藏) */
	.end-title {
		display: flex;
	}

	.end-title view {
		flex-grow: 1;
		text-align: center;
	}

	.end-cont {
		display: none;
		background: #C8C7CC;
	}

	.btna {
		color: #FFFFFF;
		background: #00A0FF;
	}

	.dis {
		display: block;
	}
</style>
