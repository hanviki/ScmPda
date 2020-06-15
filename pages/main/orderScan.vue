<template>
	<view>
		<u-table :align="align" :borderColor="borderColor" :style="{
			display:'block' 
		}">
			<u-tr>
				<u-td width="40%">药品名称</u-td>
				<u-td width="20%">计划数量</u-td>
				<u-td width="20%">预收数量</u-td>
				<u-td width="20%">计划编号</u-td>
			</u-tr>
			<template v-for="item in unDolist ">
				<u-tr>
					<u-td width="100%">送货清单号:{{ item.id }} 供应商:{{item.gysname}} </u-td>
				</u-tr>
				<u-tr v-for="item2 in item.innerData" :key="item2.id">
					<u-td width="40%">{{ item2.txz01 }}</u-td>
					<u-td width="20%">{{ item2.gMenge }}</u-td>
					<u-td width="20%">{{ item2.createTime.substr(0,10) }}</u-td>
					<u-td width="20%">{{ item2.id }}</u-td>
				</u-tr>
			</template>
		</u-table>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				unDolist: {},
				borderColor: '#e4e7ed',
				align: 'center',
				loading: false

			}
		},
		props: {},
		mounted() {

		},
		methods: {
			getPlanList: function(id) { //第一次回去数据
				this.$request.TokenRequest({
					url: 'scmBSendorder/phoneSendOrder', //待
					method: 'get'
				}, {
					id: id
				}).then((r) => {
					let data = r[1].data
					for (let item of data.rows) {
						this.unDolist.push(item);
					}

				}).catch((e) => {
					console.log(e)
					uni.showToast({
						icon: 'none',
						title: '无对应送货清单'
					});
				});

			}
		}
	}
</script>


<style>

</style>
