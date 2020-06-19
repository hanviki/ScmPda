<template>
	<view style="width: 98%;">
		<u-field v-model="id" label="二维码:" @input="scanchange" :field-style="{border: '#00A0FF solid 1rpx'}">
		</u-field>
		<u-card title="供应计划预收" style="width: 98%;" v-show="inV==1">
			<view slot="body" class="">
				<u-field v-model="scm_b_supply.gysname" :label-width="150" :disabled="true" label="供应商名称:">
				</u-field>
				<u-field v-model="scm_b_supply.txz01" :label-width="150" :disabled="true" label="药品名称:">
				</u-field>
				<u-field v-model="scm_b_supply.matnr" :label-width="150" :disabled="true" label="药品编码:">
				</u-field>
				<u-field v-model="scm_b_supply.werkst" :label-width="150" :disabled="true" label="院区:">
				</u-field>
				<u-field v-model="scm_b_supply.lgortName" :label-width="150" :disabled="true" label="库房:">
				</u-field>
				<u-field v-model="scm_b_supply.charge" :label-width="150" :disabled="true" label="批次:">
				</u-field>
				<u-field v-model="scm_b_supply.vfdat" :label-width="150" :disabled="true" label="有效期:">
				</u-field>
				<!--<u-field v-model="scm_b_supply.fphm" label="发票号码">
				</u-field>
				<u-field v-model="scm_b_supply.fpjr" label="发票金额">
				</u-field>-->

				<u-field v-model="scm_b_supply.gMenge" :label-width="150" :disabled="true" label="供应数量:">
				</u-field>
				<u-field :disabled="true" :label-width="150" v-model="scm_b_supply.doneMenge==null?0:scm_b_supply.doneMenge" label="已收数量:">
				</u-field>
				<u-field v-model="scm_b_supply.undoMenge" :label-width="150" label="预收数量:" :field-style="{border: '#00A0FF solid 1rpx'}"
				 placeholder="请输入预收数量">
				</u-field>
			</view>
			<view class="" slot="foot" style="text-align: center;">
				<u-button size="medium" type="primary" @click="doReceive" v-show="status==0?true:false">预收</u-button>
				<u-button size="medium" type="primary" @click="doReceiveCancel" v-show="status_cancel==1?true:false">取消预收</u-button>
			</view>
		</u-card>
		<u-card title="送货清单" style="width: 98%;" v-show="inV==2">
			<view class="" slot="body">
				<template v-for="item in unDolist ">
					<view>{{ item.id }}
						<u-line color="red" direction="col" hair-line="1px" length="30rpx" />{{item.gysname}}
					</view>
					<scroll-view style="height: 500rpx;" :scroll-y="true">
						<u-collapse>
							<u-collapse-item :title="item2.id+'|'+item2.txz01" v-for="(item2, index) in item.innerData" :key="item2.id">
								<u-field v-model="item2.matnr" :label-width="150" :disabled="true" label="药品编码:">
								</u-field>
								<u-field v-model="item2.werkst" :label-width="150" :disabled="true" label="院区:">
								</u-field>
								<u-field v-model="item2.lgortName" :label-width="150" :disabled="true" label="库房:">
								</u-field>
								<u-field v-model="item2.charge" :label-width="150" :disabled="true" label="批次:">
								</u-field>
								<u-field v-model="item2.vfdat" :label-width="150" :disabled="true" label="有效期:">
								</u-field>
								<u-field v-model="item2.fphm" :label-width="150" :disabled="true" label="发票号码">
								</u-field>
								<u-field v-model="item2.fpjr" :label-width="150" :disabled="true" label="发票金额">
								</u-field>
								<u-field v-model="item2.gMenge" :label-width="150" :disabled="true" label="供应数量:">
								</u-field>
								<u-field :label-width="150" :disabled="true" v-model="item2.doneMenge==null?0:item2.doneMenge" label="已收数量:">
								</u-field>
							</u-collapse-item>
						</u-collapse>
					</scroll-view>
				</template>
				<!--
				<u-table :align="align" :borderColor="borderColor" :style="{
					display:'block' 
				}">
					<u-tr>
						<u-td width="35%">药品名称</u-td>
						<u-td width="20%">计划数量</u-td>
						<u-td width="20%">预收数量</u-td>
						<u-td width="25%">计划编号</u-td>
					</u-tr>
					<template v-for="item in unDolist ">
						<u-tr>
							<u-td width="100%">送货清单号:{{ item.id }} 供应商:{{item.gysname}} {{item.createTime.substr(0,10)}}</u-td>
						</u-tr>
						<u-tr v-for="item2 in item.innerData" :key="item2.id">
							<u-td width="35%">{{ item2.txz01 }}</u-td>
							<u-td width="20%">{{ item2.gMenge }}</u-td>
							<u-td width="20%">{{ item2.doneMenge }}</u-td>
							<u-td width="25%">{{ item2.id }}</u-td>
						</u-tr>
					</template>
				</u-table>-->
			</view>
			<view class="" slot="foot" style="text-align: center;">
				<u-row gutter="16">
					<u-button size="medium" type="primary" v-show="isShowStock==0?true:false" @click="inStock">入库</u-button>
					<u-button size="medium" type="primary" v-show="isShowStock==1?true:false" @click="outStock">退库</u-button>
				</u-row>
			</view>
		</u-card>
	<!-- 	<scan-code ref="sc" @scancodedate="inputChange"></scan-code> -->
	</view>
</template>

<script>
	// import orderSacn from '../../pages/main/orderScan'
	import scanCode from '../../components/scan-code/scan-code'
     var _codeQueryTag = false
	var _sef = this
	export default {
		components: {
			//orderSacn
		},
		created() {
			this.$scan.intent_main().registerReceiver(this.$scan.intent_receiver(), this.$scan.intent_filter());
			//main.registerReceiver(receiver, filter);
		},
		onUnload() {
			this.$scan.intent_main().unregisterReceiver(this.$scan.intent_receiver());
		},
		onShow: function() {
			var _this = this
			uni.$off('scancodedate') // 每次进来先 移除全局自定义事件监听器  
			uni.$on('scancodedate', function(data) {
				if (_codeQueryTag) return false;
				_codeQueryTag = true;
				setTimeout(function() {
					_codeQueryTag = false;
				}, 150);
				_this.id = data
				_this.scanchange()
			})
		},
		data() {
			return {
				unDolist: [],
				borderColor: '#e4e7ed',
				align: 'center',
				inV: 0,
				id: '',
				status: 0, //是否可以预收
				status_cancel: 0, //取消预收 0 不显示 1显示
				isDone: 0, //是否可以收获
				info: '',
				isShowStock: 0, //是否可以清货清单入库
				scm_b_supply: {
					status: 1,
					txz01: '',
					matnr: '',
					gMenge: 0,
					werkst: '',
					lgortName: '',
					charge: '',
					vfdat: '',
					hsdat: '',
					fphm: '',
					fpjr: 0,
					gysaccount: '',
					gysname: '',
					pkgAmount: '', //包装规格
					pkgNumber: 0, //包装数量
					outCause: '',
					doneMenge: 0,
					outDate: '', //补货时间
					undoMenge: 0 //未收数量
				}
			}
		},
		
		methods: {
			inputChange(id) {
				this.id = id
				this.scanchange()
			},
			scanchange() {
				this.inV = 0
				if (this.id.trim().length === 12 && this.id.trim().indexOf("1") === 0) {
					this.inV = 1
                    this.unDolist = []
					//this.id = id
					this.getPreSupply(this.id)
				}
				if (this.id.trim().length === 12 && this.id.trim().indexOf("2") === 0) {
					this.inV = 2

					//this.id = id
					this.getPlanList(this.id)
				}
			},
			getPreSupply(id) {
				this.$request.TokenRequest({
					url: 'viewSupplyplan/' + id, //待
					method: 'get'
				}, {

				}).then((r) => {
					this.status = 0
					console.info(r)
					let data = r[1].data
					if (data != null) {
						this.scm_b_supply = data
						this.scm_b_supply.undoMenge = 0; //初始值设为0 this.scm_b_supply.gMenge - (this.scm_b_supply.doneMenge == null ? 0 : this.scm_b_supply.doneMenge)
						this.status_cancel = this.scm_b_supply.doneMenge == null ? 0 : (this.scm_b_supply.doneMenge > 0 ? 1 : 0)
						if (this.scm_b_supply.gMenge == this.scm_b_supply.doneMenge) {
							this.status = 1
						}
						if (this.scm_b_supply.status == 1) {
							this.status = 1
						}
					}
				}).catch((e) => {
					console.log(e)
				});
			},
			doReceive() {
				let dm = this.scm_b_supply.doneMenge == null ? 0 : this.scm_b_supply.doneMenge //已收货
				if (this.scm_b_supply.undoMenge == 0 || this.scm_b_supply.undoMenge == '') {
					uni.showToast({
						icon: 'none',
						title: '请填写预收数量'
					})
					return false
				}
				if ((parseFloat(dm) + parseFloat(this.scm_b_supply.undoMenge)) > this.scm_b_supply.gMenge) {
					uni.showToast({
						icon: 'none',
						title: '已经超过供应计划数量，请核实！'
					})
					return false
				}
				this.setDone(this.id, this.scm_b_supply.undoMenge, dm);
			},
			doReceiveCancel() {
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/cancel', //待
					method: 'put'
				}, {
					id: this.id
				}).then((r) => {
					console.info(r)
					let data = r[1].data
					if (data == '') {
						uni.showToast({
							icon: 'none',
							title: '取消预收成功！'
						})
						this.scm_b_supply.doneMenge = 0
						this.scm_b_supply.undoMenge = 0
						this.status_cancel = 0 //显示取消预收
						this.status = 0
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					console.log(e)
				});
			},
			setDone(id, menge, donemenge) { //预收
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/done', //待
					method: 'put'
				}, {
					id: id,
					doneMenge: menge
				}).then((r) => {
					console.info(r)
					let data = r[1].data
					if (data == '') {
						uni.showToast({
							icon: 'none',
							title: '预收成功！'
						})
						this.scm_b_supply.doneMenge = parseFloat(donemenge) + parseFloat(menge)
						this.status_cancel = 1 //显示取消预收
						if (this.scm_b_supply.gMenge == this.scm_b_supply.doneMenge) {
							this.status = 1
						}
						if (this.scm_b_supply.status == 1) {
							this.status = 1
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					console.log(e)
				});
			},
			getPlanList(id) { //第一次回去数据
				this.unDolist = []
				this.$request.TokenRequest({
					url: 'scmBSendorder/phoneSendOrder', //待
					method: 'get'
				}, {
					id: id
				}).then((r) => {
					let data = r[1].data
					for (let item of data.rows) {
						this.unDolist.push(item);
						if (item.innerData[0].status == "0") {
							this.isShowStock = 0
						} else {
							this.isShowStock = 1
						}

					}

				}).catch((e) => {
					console.log(e)
					uni.showToast({
						icon: 'none',
						title: '无对应送货清单'
					});
				});

			},
			inStock() { //入库
				let data = ''
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/overSendOrder', //待
					method: 'put'
				}, {
					sendOrderId: this.id
				}).then((r) => {
					console.info(r)
					data = r[1].data
					if (data == '') {
						uni.showToast({
							icon: 'none',
							title: '入库成功！'
						})
						this.isShowStock = 1
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					console.log(e)
				});
			},
			outStock() {
				let data = ''
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/cancelSendOrder', //待
					method: 'put'
				}, {
					sendOrderId: this.id
				}).then((r) => {
					console.info(r)
					data = r[1].data
					if (data == '') {
						uni.showToast({
							icon: 'none',
							title: '退库成功！'
						})
						this.isShowStock = 0
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					console.log(e)
				});
			}


		}
	}
</script>

<style>
	field-style {
		border: #00A0FF solid 1rpx;
	}
</style>
