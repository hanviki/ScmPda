const intent_main = () => {
	return plus.android.runtimeMainActivity(); //获取activity  
	}
	
const intent_filter = () => {
	var IntentFilter = plus.android.importClass('android.content.IntentFilter');
	let filter = new IntentFilter();
	filter.addAction("com.zebra.datacapture1.ACTION"); // 换你的广播动作  
	return filter
}
const intent_receiver = () => {
	let receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
		onReceive: function(context, intent) {
			plus.android.importClass(intent);
			let code = intent.getStringExtra("com.symbol.datawedge.data_string"); // 换你的广播标签  
			uni.$emit('scancodedate', code)
		}
	});
	return receiver
}

export default {
	intent_main,
	intent_filter, 
	intent_receiver
}
