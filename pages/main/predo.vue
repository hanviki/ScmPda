<template>
	<view>
		<u-row gutter="16">
			<u-col span="10">
				<view>查询条件</view>
			</u-col>
			<u-col span="2">
				<u-icon name="arrow-down" v-show="IsDownUp == 0" @click="display(1)"></u-icon>
				<u-icon name="arrow-up" v-show="IsDownUp == 1" @click="display(0)"></u-icon>
			</u-col>
		</u-row>
		<view class="search-group">
			<view>
				<u-field v-model="id" label="供应计划号" placeholder="请输入供应计划号">
				</u-field>
			</view>
			<view>
				<u-cell-group>
					<u-field v-model="queryParams.keyword_mater" label="药品" placeholder="请输入药品名称/编码">
					</u-field>
				</u-cell-group>
				<u-cell-group>
					<u-field v-model="queryParams.keyword_gys" label="供应商" placeholder="请输入供应商名称/账号">
					</u-field>
				</u-cell-group>
			</view>
			<view v-show="IsDownUp == 1">
				<u-cell-group>
					<u-field @click="showPicker" v-model="werkst" :disabled="true" label="院区" placeholder="请选择院区" right-icon="arrow-down-fill">
					</u-field>
				</u-cell-group>
				<u-picker mode="selector" v-model="show" @confirm="confirm" :range="werksList" range-key="name">

				</u-picker>
			</view>
			<view v-show="IsDownUp == 1">
				<u-cell-group>
					<u-field @click="showPickerLgort" v-model="lgortName" :disabled="true" label="库房" placeholder="请选择库房" right-icon="arrow-down-fill">
					</u-field>
				</u-cell-group>
				<u-picker mode="selector" v-model="showLgort" @confirm="confirmLgort" :range="lgortList" range-key="name">

				</u-picker>
			</view>
		</view>
		<u-loading mode="circle" :show="loading"></u-loading>
		<view>
			<u-button size="default" type="primary" @click="getPlanList">查询</u-button>
		</view>
		<view>
			查询结果
			<view class="m-input-icon" style="float: right; margin-top: 0px;">
				共{{totalCount}}条记录
			</view>
		</view>
		<!--<u-table :align="align" :borderColor="borderColor" :style="{
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
					<u-td width="100%">送货清单号:{{ item.id }} 供应商:{{item.gysname}} {{item.createTime.substr(0,10)}}</u-td>
				</u-tr>
				<u-tr v-for="item2 in item.innerData" :key="item2.id">
					<u-td width="40%">{{ item2.txz01 }}</u-td>
					<u-td width="20%">{{ item2.gMenge }}</u-td>
					<u-td width="20%">{{ item2.createTime.substr(0,10) }}</u-td>
					<u-td width="20%">{{ item2.id }}</u-td>
				</u-tr>
			</template>
			
		</u-table>-->
				<u-collapse>
					<u-collapse-item :title="item2.id+'|'+item2.txz01" v-for="(item2, index) in unDolist" :key="index">
						<u-field v-model="item2.matnr" label="药品编码:">
						</u-field>
						<u-field v-model="item2.werkst" label="院区:">
						</u-field>
						<u-field v-model="item2.lgortName" label="库房:">
						</u-field>
						<u-field v-model="item2.charge" label="批次:">
						</u-field>
						<u-field v-model="item2.vfdat" label="有效期:">
						</u-field>
						<u-field v-model="item2.fphm" label="发票号码">
						</u-field>
						<u-field v-model="item2.fpjr" label="发票金额">
						</u-field>
						<u-field v-model="item2.gMenge" disabled="true" label="供应数量:">
						</u-field>
						<u-field disabled="true" v-model="item2.doneMenge==null?0:item2.doneMenge" label="已收数量:">
						</u-field>
					</u-collapse-item>
				</u-collapse>

	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue'

	var _self;
	var page = 1;
	export default {
		components: {
			mInput
		},
		data() {
			return {
				unDolist: {},
				loadingType: 0,
				IsDownUp: 0,
				borderColor: '#e4e7ed',
				align: 'center',
				queryParams: {
					gysaccount: '',
					werks: '0',
					status: 0,
					lgort: '0',
					eindt: this.getDate('start'),
					bedat: this.getDate(),
					sortOrder: 'descend',
					pagesize: 10,
					pageNum: page,
					sortField:'Create_TIME'
				},
				loading: false,
				mode: false,
				show: false,
				showLgort: false,
				werksList: [],
				lgortList: [],
				areaList: [],
				id: '',
				werkst: '',
				lgortName: '',
				totalCount: 0
			}
		},
		mounted() {
			_self = this;
			this.getPlanList();
			this.getAreaList();
		},
		onPullDownRefresh() { //下拉刷新
			page = 1;
			this.getPlanList();
		},

		onReachBottom: function() {
			page++; //每触底一次 page +1
			// console.log(_self.hotRecommendlist.length);
			if (_self.loadingType != 0) { //loadingType!=0;直接返回
				return false;
			}
			_self.loadingType = 1;
			// console.log(page);
			uni.showNavigationBarLoading(); //显示加载动画
			this.getPlanList();
		},
		methods: {
			showPicker() {
				this.show = true;
			},
			showPickerLgort() {
				this.showLgort = true;
			},
			display(index) {
				this.IsDownUp = index;
			},
			getAreaList: function() { //第一次回去数据
				this.$request.TokenRequest({
					url: 'scmDArea/userArea', //待
					method: 'get'
				}, {

				}).then((r) => {
					let data = r[1].data.data
					this.areaList = data
					this.werksList = data.filter(t => t.parentId == '0');
					this.werksList.push({
						id: '-1',
						name: '全部',
						code: '0'
					});
					this.lgortList = [];
				}).catch((e) => {
					console.log(e)
				});

			},
			clickWerksItem(index) {
				this.werkst = this.werksList[index].name;
				this.queryParams.werks = this.werksList[index].code;
			},
			confirm(e) {
				this.werkst = this.werksList[e[0]].name;
				this.queryParams.werks = this.werksList[e[0]].code;
				this.lgortList = this.areaList.filter(t => t.parentId == this.werksList[e[0]].id);

				this.lgortName = '';
				this.queryParams.lgort = '0';
			},
			confirmLgort(e) {
				this.lgortName = this.lgortList[e[0]].name;
				this.queryParams.lgort = this.lgortList[e[0]].code;
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					month = month - 1;
					if (month === -1 || month === 0) {
						month = 12;
						year = year - 1;
					}
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				console.log(month)
				return new Date(`${year}-${month}-${day}`);
			},
			getPlanList: function() { //第一次回去数据
				this.queryParams.id = this.id == '' ? '0' : this.id;
				this.totalCount = 0;
				
				uni.showNavigationBarLoading();
				this.loading = true;
				this.$request.TokenRequest({
					url: 'viewSupplyplan/doneStatus/0', //待
					method: 'get'
				}, this.queryParams).then((r) => {
					this.loading = false;
					let data = r[1].data
					this.totalCount = data.total
					if (page > 1) {
						for (let item of data.rows) {
							this.unDolist.push(item);
						}
					} else {
						this.unDolist = data.rows
					}
					if (page * 10 >= data.total) {
						_self.loadingType = 2;
						uni.hideNavigationBarLoading(); //关闭加载动画
						return false;
					}
					uni.hideNavigationBarLoading();
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
				}).catch((e) => {
					this.loading = false;
					console.log(e)
					uni.showToast({
						icon: 'none',
						title: '获取数据失败'
					});
				});

			}
		}
	}
</script>


<style>

</style>
