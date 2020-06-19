<template>
	<view>
		<view class="content"></view>
		<view>{{data2}}</view>
		<view>{{data1}}</view>
		<view>{{data3}}</view>
	</view>
</template>

<script>
	import store from '../../store'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	var main, receiver, filter ,_sef;
	var _codeQueryTag = false;
	export default {
		data() {
			return {
				scanCode: '',
				data2: 'haha2020',
				data1: 'meishi',
				data3: 0
			}
		},
		created: function () {  
			_sef=this
			this.data3=store.state.scanTimes
			this.data1='开始监听'
		    this.initScan()  
		    this.startScan();  
			this.data1='开始监听22'
		},   
		// mounted() {
		// 	this.initScan()
		// 	this.startScan();
		// },
		onHide: function() {
			this.stopScan();
		},
		beforeDestroy: function() {
			this.data1='关闭监听'
			/*页面退出时一定要卸载监听,否则下次进来时会重复，造成扫一次出2个以上的结果*/
			this.stopScan();
			this.data1='关闭监听2'
		},
		onUnload() {
			this.stopScan();
		},
		methods: {
			...mapMutations(['setScanTimes']),
			initScan() {
				let _this = this;
				main = plus.android.runtimeMainActivity(); //获取activity  
				var IntentFilter = plus.android.importClass('android.content.IntentFilter');
				filter = new IntentFilter();
				filter.addAction("com.zebra.datacapture1.ACTION"); // 换你的广播动作  

				receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
					onReceive: function(context, intent) {
                        _this.data1='receive接受数据';
						plus.android.importClass(intent);
						let code = intent.getStringExtra("com.symbol.datawedge.data_string"); // 换你的广播标签  
						_this.queryCode(code);
					}
				});

			},
			startScan() {
				main.registerReceiver(receiver, filter);
			},
			stopScan() {
				_sef.setScanTimes(12)
				main.unregisterReceiver(receiver);
			},
			queryCode: function(code) {
				//防重复  
				if (_codeQueryTag) return false;
				_codeQueryTag = true;
				setTimeout(function() {
					_codeQueryTag = false;
				}, 150);
				var id = code
				_sef.data1=id
				_sef.setScanTimes(1)
				_sef.$emit('scancodedate', id)
			}
		}
	}
</script>

<style>
	page {
		background-color: #efeff4;
	}

	.content {
		text-align: center;
	}
</style>
