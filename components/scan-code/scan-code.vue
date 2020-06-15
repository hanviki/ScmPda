<template> 
 <view>
    <view class="content"></view>
</view>
</template>  

<script>  
var main,receiver,filter;    
var _codeQueryTag = false;    
export default {  
    data() {  
        return {  
            scanCode: '',
			data1: '',
			data2: '',
			data3: ''
        }  
    },  
    created: function () {  
        this.initScan()  
        this.startScan();    
    },    
    onHide:function(){    
        this.stopScan();    
    },  
    destroyed:function(){    
        /*页面退出时一定要卸载监听,否则下次进来时会重复，造成扫一次出2个以上的结果*/    
        this.stopScan();    
    },    
    methods: {  
        initScan() {  
            let _this = this;  
			_this.data1="开始了"
            main = plus.android.runtimeMainActivity();//获取activity  
            var IntentFilter = plus.android.importClass('android.content.IntentFilter');   
            filter = new IntentFilter();    
            filter.addAction("com.zebra.datacapture1.ACTION"); // 换你的广播动作  
			
            receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver',{  
            onReceive : function(context, intent) {  
				_this.data2="onReceive"
                plus.android.importClass(intent);     
                let code = intent.getStringExtra("com.symbol.datawedge.data_string");// 换你的广播标签  
                _this.queryCode(code);    
            }});    
			
        },    
        startScan(){    
            main.registerReceiver(receiver,filter);  
        },    
        stopScan(){  
            main.unregisterReceiver(receiver);    
        },    
        queryCode: function(code){  
            //防重复  
            if(_codeQueryTag)return false;    
            _codeQueryTag = true;    
            setTimeout(function(){    
                _codeQueryTag = false;    
            },150);  
            var id = code  
            this.$emit('scancodedate',id)  
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