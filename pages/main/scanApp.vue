<template>
	<view style="width: 98%; font-size: medium;margin-top: 15px;">
		<view>
			<u-row gutter="16">
				<u-col span="8">
					<u-field v-model="id2" label="二维码:" @input="inputChange" :field-style="{border: '#00A0FF solid 1rpx'}">
					</u-field>
				</u-col>
				<u-col span="2">
					<icon type="warn" v-if="isIconDone" />
				</u-col>
				<u-col span="2">
					<image style="width: 40px; height: 40px;" src="../../static/img/prescan.jpg" @click="tel()" ></image>
				</u-col>
			</u-row>
		</view>
		<view class="" v-show="inV==1">
			<u-field v-model="scm_b_supply.gysname" :label-width="150" :disabled="true" label="供应商:">
			</u-field>
			<u-field v-model="scm_b_supply.matnr" :label-width="150" :disabled="true" label="药品编码:">
			</u-field>
			<u-field v-model="scm_b_supply.txz01" :label-width="150" :disabled="true" label="药品名称:">
			</u-field>
			<!--<u-field v-model="scm_b_supply.werkst" :label-width="150" :disabled="true" label="院区:">
			</u-field>-->
			<u-field v-model="lgortName" :label-width="150" :disabled="true" label="库房:">
			</u-field>
			<u-field v-model="scm_b_supply.charge" :label-width="150" :disabled="true" label="批次:">
			</u-field>

			<view>
				<u-row gutter="16">
					<u-col span="6">
						<u-field v-model="vfdat" :label-width="150" :disabled="true" label="有效期:">
						</u-field>
					</u-col>
					<u-col span="6">
						<icon type="warn" v-if="isIconName" />
					</u-col>
				</u-row>
			</view>
			<!--<u-field v-model="scm_b_supply.fphm" label="发票号码">
				</u-field>
				<u-field v-model="scm_b_supply.fpjr" label="发票金额">
				</u-field>-->

			<u-field v-model="scm_b_supply.gMenge" :label-width="150" :disabled="true" label="供应数量:">
			</u-field>
			<u-field :disabled="true" :label-width="150" v-model="scm_b_supply.doneMenge==null?0:scm_b_supply.doneMenge" label="已收数量:">
			</u-field>
			<u-field v-model="scm_b_supply.undoMenge" :label-width="150" :disabled="true" label="预收数量:" :field-style="{border: '#00A0FF solid 1rpx'}"
			 placeholder="请输入预收数量">
			</u-field>
			<view style="text-align: center;">
				<u-button size="medium" type="primary" @click="doReceive" :loading="loading" v-show="status==0?true:false">预收</u-button>
				<u-button size="medium" style="margin-left: 10rpx;" :loading="loading" type="primary" @click="doReceiveCancel"
				 v-show="status_cancel==1?true:false">取消预收</u-button>
			</view>
		</view>

		<view class="" v-show="inV==2">
			<view>{{ unDolist.id }}
				<u-line color="red" direction="col" hair-line="1px" length="30rpx" />{{unDolist.gysname}}
			</view>
			<scroll-view style="height: 700rpx;" :scroll-y="true">
				<uni-collapse ref="hol">
					<template v-for="(item2, index) in unDolist.innerData">
						<uni-collapse-item :title="item2.id+'|'+item2.txz01">
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
							<u-field :label-width="150" :disabled="true" v-model="item2.doneMenge==null?0:item2.doneMenge" label="预收数量:">
							</u-field>
						</uni-collapse-item>
					</template>
				</uni-collapse>
			</scroll-view>
			<view class="" style="text-align: center;">
				<u-row gutter="16">
					<u-button size="medium" type="primary" :loading="loading" v-show="isShowStock==0?true:false" @click="inStock">入库</u-button>
					<u-button size="medium" type="primary" :loading="loading" v-show="isShowStock==1?true:false" @click="outStock">退库</u-button>
				</u-row>
			</view>
		</view>
		<u-modal v-model="showModal" title="供应计划号变更" confirm-color="#606266" cancel-color="#2979ff" :content="modalContent"
		 @confirm="confirm" ref="uModal" :show-cancel-button="true"></u-modal>
		<u-modal v-model="showModal2" title="箱条码重复扫描" confirm-color="#606266" cancel-color="#2979ff" :content="modalContent2"
		 @confirm="confirm2" ref="uModal2" :show-cancel-button="true"></u-modal>
		<u-no-network></u-no-network>
		<!-- 	<scan-code ref="sc" @scancodedate="inputChange"></scan-code> -->
	</view>
</template>

<script>
	// import orderSacn from '../../pages/main/orderScan'
	import scanCode from '../../components/scan-code/scan-code'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	var _codeQueryTag = false
	var _sef = this
	export default {
		components: {
			//orderSacn
		},
		created() {
			//this.$scan.intent_main().registerReceiver(this.$scan.intent_receiver(), this.$scan.intent_filter());
			//main.registerReceiver(receiver, filter);
		},
		onUnload() {
			//this.$scan.intent_main().unregisterReceiver(this.$scan.intent_receiver());
		},
		
		data() {
			return {
				unDolist: {},
				borderColor: '#e4e7ed',
				align: 'center',
				inV: 0,
				id: '',
				id2: '',
				currentId: '', //当前供应计划的ID
				newId: '', //扫描的二维码值
				status: 0, //是否可以预收
				status_cancel: 0, //取消预收 0 不显示 1显示
				isDone: 0, //是否可以收获
				isIconDone: false, //是否显示
				info: '',
				isShowStock: 0, //是否可以清货清单入库
				IsNew: true,
				HasDone: 0,
				scanPlan: [], //扫过的箱数记录
				showModal: false,
				showModal2: false,
				modalContent: '供应计划号发生改变,是否变更',
				modalContent2: '此二维码已经预收，是否跳转？若跳转则之前扫描数据将被清除！',
				vff: '',
				loading: false,
				supplyBackData: {
					status: 1,
					txz01: '',
					matnr: '',
					gMenge: '',
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
					pkgNumber: '', //包装数量
					outCause: '',
					doneMenge: '',
					outDate: '', //补货时间
					undoMenge: 0, //未收数量
					subMenge: 0
				},
				scm_b_supply: {
					status: 1,
					txz01: '',
					matnr: '',
					gMenge: '',
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
					pkgNumber: '', //包装数量
					outCause: '',
					doneMenge: '',
					outDate: '', //补货时间
					undoMenge: 0, //未收数量
					subMenge: 0
				}
			}
		},

		computed: {

			lgortName: function() {
				let werk = "";
				console.log(this.scm_b_supply.werks)
				if (this.scm_b_supply.werks == 2000) {
					werk = "本部-"
				}
				if (this.scm_b_supply.werks == 2100) {
					werk = "肿瘤-"
				}
				if (this.scm_b_supply.werks == 2200) {
					werk = "西院-"
				}
				return werk + (this.scm_b_supply.lgortName == null ? "" : this.scm_b_supply.lgortName);
			},
			isIconName: function() {
				let iName = false //对号
				if (this.scm_b_supply.vfdat != '' && this.scm_b_supply.vfdat != null) {
					iName = this.formatDate(this.scm_b_supply.vfdat)
				}
				return iName;
			},

			vfdat: function() {
				let vf = "" //对号
				if (this.scm_b_supply.vfdat != '' && this.scm_b_supply.vfdat != null) {
					vf = this.formatDate2(this.scm_b_supply.vfdat)
				}
				return vf
			}
		},
		methods: {
			tel() {
			   let	_this = this
				uni.scanCode({
					success: function(res) {
						_this.newId = res.result
						if (!_this.showModal && !_this.showModal2) {
							_this.scanHandle()
						}
					}
				})
			},
			inputChange(id) {
				this.newId = id
				if (id != '' && !this.showModal && !this.showModal2) {
					this.scanHandle()
				}
			},
			stringSub(str) {
				if (str != '') {
					if (str.length >= 13) {
						return str.substring(0, 12)
					}
					if (str.length == 12) {
						return str
					}
				}
				return ''
			},
			scanHandle() {
				console.info("scanPlan" + this.scanPlan)
				this.isIconDone = false
				if (this.stringSub(this.newId) != this.stringSub(this.id) && this.id != '') {
					//console.info("不同的条码")
					if (this.id.trim().indexOf("1") === 0) {
						this.showModal = true
					} else {
						this.id = this.newId
						this.id2 = this.newId
						this.scanchange()
					}
				} else {
					if (this.newId.trim().indexOf("1") === 0) {
						console.info(this.id)
						if (this.scanPlan.indexOf(this.newId) >= 0) {
							this.isIconDone = true
							uni.showToast({
								icon: 'none',
								title: this.newId + '已经扫过！！'
							})
						}

						this.getSupplyCheck(this.newId);

					} else {
						this.id = this.newId
						this.id2 = this.newId
						this.scanchange()
					}
				}
			},
			confirm() {
				this.showModal = false
				this.id = this.newId
				this.id2 = this.newId
				this.currentId = this.stringSub(this.newId)

				this.scanPlan = []
				//this.scanPlan.push(this.currentId)


				this.HasDone = 0
				this.scanchange()
			},
			confirm2() {
				this.showModal2 = false
				this.id = this.newId
				this.id2 = this.newId
				this.currentId = this.stringSub(this.newId)

				this.scanPlan = []


				this.HasDone = 0

				this.scm_b_supply = this.supplyBackData
				this.scm_b_supply.undoMenge = parseFloat(this.scm_b_supply.subMenge) //获取每条数据的结果

				this.status_cancel = this.scm_b_supply.subState //是否预收
				this.status = this.scm_b_supply.subState
				if (this.scm_b_supply.subState == 1) {
					this.isIconDone = true
				}

				if (this.scm_b_supply.status == 1) { //已经入库的 不显示
					this.isIconDone = true
					this.status = 1
					this.status_cancel = 0
				}
			},
			scanchange() {
				this.isIconDone = false
				this.inV = 0
				if (this.id.trim().length >= 12 && this.id.trim().length <= 17 && this.id.trim().indexOf("1") === 0) {
					//this.id = this.newId
					this.inV = 1

					this.$refs.hol.destoryChildren()
					//this.removeUndoList()
					this.unDolist.innerData = []
					this.unDolist = {}
					//this.id = id
					this.getPreSupply(this.id)
				}
				if (this.id.trim().length >= 12 && this.id.trim().length <= 17 && this.id.trim().indexOf("2") === 0) {
					//this.id = this.newId
					this.inV = 0
					this.$refs.hol.destoryChildren()

					this.unDolist.innerData = []
					this.unDolist = {}
					//this.id = id
					this.IsNew = false
					let that = this
					setTimeout(function() { //解决pda扫描送货清单 不能清空下拉
						that.getPlanList(that.id)
					}, 200)
				}
			},
			getSupplyCheck(id) {
				let that = this
				this.$request.TokenRequest({
					url: 'viewSupplyplan/forPadScan/' + id, //待
					method: 'get'
				}, {

				}).then((r) => {
					that.status = 0
					console.info(r)
					let data = r[1].data
					if (data != null) {
						that.supplyBackData = data
						if (that.supplyBackData.subState == 1 && that.scanPlan.length > 0 && that.supplyBackData.status == 0) {
							//that.modalContent2 = "此二维码已经预收，是否跳转，跳转则之前扫描数据被清空"
							that.showModal2 = true
						} else {
							that.id2 = that.newId
							that.id = that.newId
							that.inV = 1

							that.$refs.hol.destoryChildren()
							//this.removeUndoList()
							that.unDolist.innerData = []
							that.unDolist = {}
							that.scm_b_supply = that.supplyBackData

							//console.info("HasDone" + that.HasDone)
							if (that.scanPlan.indexOf(that.newId) >= 0) {
								that.scm_b_supply.undoMenge = parseFloat(that.HasDone) //获取每条数据的结果
							} else {
								if (that.scm_b_supply.subState == 1 || that.scm_b_supply.status == 1) {

									that.scm_b_supply.undoMenge = parseFloat(that.scm_b_supply.subMenge)
								} else {
									if (that.scm_b_supply.subMenge > 0) {
										that.scanPlan.push(that.newId)
										that.scm_b_supply.undoMenge = parseFloat(that.HasDone) + parseFloat(that.scm_b_supply.subMenge) //获取每条数据的结果
									} else {
										that.scm_b_supply.undoMenge = parseFloat(that.HasDone)
									}

								}
							}
							that.status_cancel = that.scm_b_supply.subState //是否预收
							that.status = that.scm_b_supply.subState
							that.HasDone = that.scm_b_supply.undoMenge
							if (that.scm_b_supply.subState == 1 || that.scm_b_supply.status == 1) {
								this.isIconDone = true
								that.HasDone = 0
							}
							if (that.scm_b_supply.status == 1) { //已经入库的 不显示
								this.isIconDone = true
								that.status = 1
								that.status_cancel = 0
							}

							//this.id = id
							//that.getPreSupply(that.id)
						}
					}
				}).catch((e) => {
					console.log(e)
				});
			},
			getPreSupply(id) {
				this.$request.TokenRequest({
					url: 'viewSupplyplan/forPadScan/' + id, //待
					method: 'get'
				}, {

				}).then((r) => {
					this.status = 0
					//console.info(r)
					let data = r[1].data
					if (data != null) {
						this.scm_b_supply = data
						//console.info("HasDone" + this.HasDone)
						if (this.scm_b_supply.subMenge > 0) {
							this.scm_b_supply.undoMenge = parseFloat(this.HasDone) + parseFloat(this.scm_b_supply.subMenge) //获取每条数据的结果
						} else {
							this.scm_b_supply.undoMenge = parseFloat(this.HasDone)
						}
						this.status_cancel = this.scm_b_supply.subState //是否预收
						this.status = this.scm_b_supply.subState

						this.HasDone = this.scm_b_supply.undoMenge
						if (this.scm_b_supply.subState == 1 || this.scm_b_supply.status == 1) {
							this.isIconDone = true
							this.HasDone = 0
						}
						if (this.scm_b_supply.subState == 0 && this.scm_b_supply.status == 0 && this.scm_b_supply.undoMenge > 0) {
							this.scanPlan.push(id)
						}
						if (this.scm_b_supply.status == 1) { //已经入库的 不显示
							this.status = 1
							this.status_cancel = 0
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
				this.setDone(this.scanPlan, this.scm_b_supply.undoMenge, dm);
			},
			doReceiveCancel() {
				this.loading = true
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/cancel', //待
					method: 'put'
				}, {
					id: this.id
				}).then((r) => {
					this.loading = false
					console.info(r)
					let data = r[1].data
					if (data == '') {
						uni.showToast({
							icon: 'none',
							title: '取消预收成功！'
						})
						this.scm_b_supply.doneMenge = 0
						this.scm_b_supply.undoMenge = 0
						this.HasDone = 0
						this.scanPlan = []
						this.status_cancel = 0 //显示取消预收
						this.id = ''
						this.id2 = ''
						this.status = 1
						this.reset()
						//this.scm_b_supply = {}
					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					this.loading = false
					console.log(e)
				});
			},
			reset() {
				let scm_b_supply_none = {
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
				this.scm_b_supply = scm_b_supply_none
				this.inV = 0
			},

			setDone(scanPlan, menge, donemenge) { //预收
				this.loading = true
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/done', //待
					method: 'put'
				}, {
					ids: scanPlan.join(','),
					doneMenge: menge
				}).then((r) => {
					this.loading = false
					console.info(r)
					let data = r[1].data
					if (data == '') {
						this.id = ''
						this.id2 = ''
						this.status = 1
						this.status_cancel = 0
						this.reset()
						uni.showToast({
							icon: 'none',
							title: '预收成功！'
						})
						// this.scm_b_supply.doneMenge = parseFloat(donemenge) + parseFloat(menge)
						// this.status_cancel = 1 //显示取消预收
						// if (this.scm_b_supply.gMenge == this.scm_b_supply.doneMenge) {
						// 	this.status = 1
						// }
						// if (this.scm_b_supply.status == 1) {
						// 	this.status = 1
						// }
						this.HasDone = 0
						this.scanPlan = []
						//this.scm_b_supply = {}

					} else {
						uni.showToast({
							icon: 'none',
							title: data.message
						})
					}
				}).catch((e) => {
					this.loading = false
					console.log(e)
				});
			},
			getPlanList(id) { //第一次回去数据
				this.$request.TokenRequest({
					url: 'scmBSendorder/pdaSendOrder', //待
					method: 'get'
				}, {
					id: id
				}).then((r) => {
					console.log(r)
					let data = r[1].data
					if (data.total == 0) {
						uni.showToast({
							icon: 'none',
							title: '无对应库房的权限或不存在的送货清单号'
						});
						this.isShowStock = 2 //不显示入库和退库按钮
					} else {
						for (let item of data.rows) {
							this.IsNew = true
							this.unDolist = item;
							if (item.innerData[0].status == "0") {
								this.isShowStock = 0
							} else {
								this.isShowStock = 1
							}

						}
						this.inV = 2
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
				this.loading = true
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/overSendOrder', //待
					method: 'put'
				}, {
					sendOrderId: this.id
				}).then((r) => {
					this.loading = false
					//console.info(r)
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
					this.loading = false
					console.log(e)
				});
			},
			outStock() {
				this.loading = true
				let data = ''
				this.$request.TokenRequest({
					url: 'scmBSupplyplan/cancelSendOrder', //待
					method: 'put'
				}, {
					sendOrderId: this.id
				}).then((r) => {
					this.loading = false
					//console.info(r)
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
					this.loading = false
					console.log(e)
				});
			},
			formatDate2(value) {
				if (value == null) {
					return ''
				}
				let vf = value.replace("00:00:00", "").trim();
				return vf
			},
			formatDate(value) {
				var vf2 = value.toString().replace("00:00:00", "").trim();
				var date2 = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				var Y2 = (parseInt(date2.getFullYear()) + 1).toString();
				var M2 = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1).toString();
				var D2 = date2.getDate() < 10 ? ('0' + date2.getDate().toString()) : date2.getDate().toString();
				//var h2 = date2.getHours() < 10 ? ('0' + date2.getHours().toString()) : date2.getHours().toString();
				//var m2 = date2.getMinutes() < 10 ? ('0' + date2.getMinutes().toString()) : date2.getMinutes().toString();
				//var s2 = date2.getSeconds() < 10 ? ('0' + date2.getSeconds().toString()) : date2.getSeconds().toString();
				let now = Y2 + "-" + M2 + "-" + D2;
				if (vf2.toString() < now) //有效期不够一年  显示
				{
					return true;
				}
				return false;
			}


		}
	}
</script>

<style>
	field-style {
		border: #00A0FF solid 1rpx;
	}

	.u-field .uni-input-input {
		font-size: 12px !important;
	}
</style>
