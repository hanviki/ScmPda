
var isReady=false;var onReadyCallbacks=[];
var __uniConfig = {"pages":["pages/main/main","pages/login/login","pages/reg/reg","pages/pwd/pwd","pages/user/user","pages/receive/preReceive/preReceive","pages/receive/DoneReceive/DoneReceive","pages/main/predo","pages/main/done","pages/main/preInStock","pages/main/doneInStock","pages/main/scan","pages/main/orderScan","components/scan-code/scan-code"],"window":{"navigationBarTextStyle":"white","navigationBarBackgroundColor":"#0faeff","backgroundColor":"#fbf9fe"},"tabBar":{"color":"#7a7e83","selectedColor":"#0faeff","backgroundColor":"#ffffff","list":[{"pagePath":"pages/main/main","text":"预收","iconPath":"static/img/home.png","selectedIconPath":"static/img/homeHL.png"},{"pagePath":"pages/receive/DoneReceive/DoneReceive","text":"入库","iconPath":"static/img/home.png","selectedIconPath":"static/img/homeHL.png"},{"pagePath":"pages/main/scan","text":"扫码","iconPath":"static/img/qq.png","selectedIconPath":"static/img/homeHL.png"},{"pagePath":"pages/user/user","text":"我的","iconPath":"static/img/user.png","selectedIconPath":"static/img/userHL.png"}]},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"ScmApp","compilerVersion":"2.7.9","entryPagePath":"pages/main/main","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/main/main","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录"}},{"path":"/pages/reg/reg","meta":{},"window":{"navigationBarTitleText":"注册"}},{"path":"/pages/pwd/pwd","meta":{},"window":{"navigationBarTitleText":"找回密码"}},{"path":"/pages/user/user","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的"}},{"path":"/pages/receive/preReceive/preReceive","meta":{},"window":{"navigationBarTitleText":"预收"}},{"path":"/pages/receive/DoneReceive/DoneReceive","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"收货"}},{"path":"/pages/main/predo","meta":{},"window":{}},{"path":"/pages/main/done","meta":{},"window":{}},{"path":"/pages/main/preInStock","meta":{},"window":{}},{"path":"/pages/main/doneInStock","meta":{},"window":{}},{"path":"/pages/main/scan","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/main/orderScan","meta":{},"window":{}},{"path":"/components/scan-code/scan-code","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
