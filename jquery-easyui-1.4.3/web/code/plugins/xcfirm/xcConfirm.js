/*
 * 使用说明:
 * window.wxc.Pop(popHtml, [type], [options])
 * popHtml:html字符串
 * type:window.wxc.xcConfirm.typeEnum集合中的元素
 * options:扩展对象
 * 用法:
 * 1. window.wxc.xcConfirm("我是弹窗<span>lalala</span>");
 * 2. window.wxc.xcConfirm("成功","success");
 * 3. window.wxc.xcConfirm("请输入","input",{onOk:function(){}})
 * 4. window.wxc.xcConfirm("自定义",{title:"自定义"})
 */
(function($){
	
	window.wxc = window.wxc || {};
	$xcAlert = function(popHtml, type, options) {
	    var btnType = $xcAlert.btnEnum;
		var eventType = $xcAlert.eventEnum;
		var popType = {
			info: {
				title: "系统消息",
				icon: "0 0",//蓝色i
				btn: btnType.ok
			},
			success: {
				title: "操作提示",
				icon: "0 -48px",//绿色对勾
				btn: btnType.ok
			},
			error: {
				title: "系统错误",
				icon: "-48px -48px",//红色叉
				btn: btnType.ok
			},
			confirm: {
				title: "信息提示",
				icon: "-48px 0",//黄色问号
				btn: btnType.okcancel
			},
			warning: {
				title: "操作警告",
				icon: "0 -96px",//黄色叹号
				btn: btnType.okcancel
			},
			input: {
				title: "输入",
				icon: "",
				btn: btnType.ok
			},
			custom: {
				title: "",
				icon: "",
				btn: btnType.ok
			},
			login: {
				title: "输入",
				icon: "",
				btn: btnType.Rlogin
			},
			warningOk : {
				title: "操作提示",
				icon: "0 -96px",//黄色叹号
				btn: btnType.ok
			}
		};
		var itype = type ? type instanceof Object ? type : popType[type] || {} : {};//格式化输入的参数:弹窗类型
		var config = $.extend(true, {
			//属性
			title: "", //自定义的标题
			icon: "", //图标
			btn: btnType.ok, //按钮,默认单按钮
			//事件
			onOk: $.noop,//点击确定的按钮回调
			onCancel: $.noop,//点击取消的按钮回调
			onClose: $.noop,//弹窗关闭的回调,返回触发事件
			onregist: $.noop,//注册
			onLogin: $.noop //登录
		}, itype, options);
		
		var $txt = $("<p>").html(popHtml);//弹窗文本dom
		var $tt = $("<span>").addClass("tt").text(config.title);//标题
		var icon = config.icon;
		var $icon = icon ? $("<div>").addClass("bigIcon").css("backgroundPosition",icon) : "";
		var btn = config.btn;//按钮组生成参数
		
		var popId = creatPopId();//弹窗索引
		
		var $box = $("<div>").addClass("xcConfirm");//弹窗插件容器
		var $layer = $("<div>").addClass("xc_layer");//遮罩层
		var $popBox = $("<div>").addClass("popBox");//弹窗盒子
		var $ttBox = $("<div>").addClass("ttBox");//弹窗顶部区域
		var $txtBox = $("<div>").addClass("txtBox");//弹窗内容主体区
		var $btnArea = $("<div>").addClass("btnArea");//按钮区域
		
		var $ok = $("<a>").addClass("sgBtn").addClass("ok").text("确定");//确定按钮
		var $regist = $("<a>").addClass("sgbtn").addClass("regist").text("注册");
		var $Login = $("<a>").addClass("sgbtn").addClass("login").text("登录");
		var $cancel = $("<a>").addClass("sgBtn").addClass("cancel").text("取消");//取消按钮
		var $input = $("<input>").addClass("inputBox");//输入框
		var $clsBtn = $("<a>").addClass("clsBtn");//关闭按钮
		var $userm = $("<input>").attr({"placeholder":"请输入手机号或邮箱","class":"inputBox"});
		var $passw = $("<input>").attr({"placeholder":"请输入密码","type":"password","class":"inputBox"});
		var $loginb = '<div class="xcforget"><a href="'+contextPath +'/main/forget.html">忘记密码？</a></div>' +
			'<div class="xctxt"><span>社交账号登陆</span>' +
			'<a onclick="weibologin();"><img src="'+contextPath +'/lib/img/images/LOGO_24x24.png"></a>' +
			'<a onclick="qqlogin();"><img src="'+contextPath +'/lib/img/images/qq_3d.png"></a></div>';
		//建立按钮映射关系
		var btns = {
			ok: $ok,
			cancel: $cancel,
			regist: $regist,
			Login: $Login
		};
		
		init();
		
		function init(){
			//处理特殊类型input
			if(popType["input"] === itype){
				$txt.append($input);
			}
			if(popType["login"] === itype){
				$popBox = $("<div>").addClass("popbox");
				$ttBox = $("<div>").addClass("ttbox");//弹窗顶部区域
				$txtBox = $("<div>").addClass("txtbox");//弹窗内容主体区
				$txtBox.append($txt).append($userm).append($passw).append($loginb);
			}
			if(popType["login"] === itype)
				creatDoms();
			else
				creatDom();
			bind();
		}
		
		function creatDom(){
			$popBox.append(
				$ttBox.append(
					$clsBtn
				).append(
					$tt
				)
			).append(
				$txtBox.append($icon).append($txt)
			).append(
				$btnArea.append(creatBtnGroup(btn))
			);
			$box.attr("id", popId).append($layer).append($popBox);
			$("body").append($box);
		}
		
		function creatDoms(){//登陆 jianghaipeng
			$popBox.append(
				$ttBox.append(
					$clsBtn
				).append(
					$tt
				)
			).append(
				$txtBox.append($icon)
			).append(
				$btnArea.append(creatBtnGroups(btn))
			);
			$box.attr("id", popId).append($layer).append($popBox);
			$("body").append($box);
		}

		function bind(){
			//点击确认按钮
			$ok.click(doOk);
			
			//回车登录事件添加 jianghaipeng
			$(window).bind("keydown", function(e){
				if(e.keyCode == 13) {
					if($("#" + popId).length == 1){
						if(itype.btn == 12)
							doLogin();
						else
							doOk();
					}
				}
			});
			//点击取消按钮
			$cancel.click(doCancel);
			
			//点击关闭按钮
			$clsBtn.click(doClose);
			//点击注册按钮
			$regist.click(doregist);
			//点击登录按钮
			$Login.click(doLogin);
		}

		//确认按钮事件
		function doOk(){
			var $o = $(this);
			var v = $.trim($input.val());
			if ($input.is(":visible"))
		        config.onOk(v);
		    else
		        config.onOk();
			$("#" + popId).remove(); 
			config.onClose(eventType.ok);
		}
		
		//取消按钮事件
		function doCancel(){
			var $o = $(this);
			config.onCancel();
			$("#" + popId).remove(); 
			config.onClose(eventType.cancel);
		}
		
		//关闭按钮事件
		function doClose(){
			$("#" + popId).remove();
			config.onClose(eventType.close);
			$(window).unbind("keydown");
		}
		//注册按钮事件
		function doregist(){
			var $o = $(this);
			var v = $.trim($input.val());
			if ($input.is(":visible"))
		        config.onregist(v);
		    else
		        config.onregist();
			$("#" + popId).remove(); 
			config.onClose(eventType.regist);
		}
		//登录按钮事件
		function doLogin(){
			var $o = $(this);
			var v = $.trim($userm.val());
			var p = $.trim($passw.val());
			if ($userm.is(":visible") && $passw.is(":visible"))
		        config.onLogin(v, p);
		    else
		        config.onLogin();
			$("#" + popId).remove(); 
			config.onClose(eventType.Login);
		}
		//生成按钮组
		function creatBtnGroup(tp){
			var $bgp = $("<div>").addClass("btnGroup");
			$.each(btns, function(i, n){
				if( btnType[i] == (tp & btnType[i]) ){
					$bgp.append(n);
				}
			});
			return $bgp;
		}
		//生成按钮组
		function creatBtnGroups(tp){
			var $bgp = $("<div>").addClass("btngroup");
			$.each(btns, function(i, n){
				if( btnType[i] == (tp & btnType[i]) ){
					$bgp.append(n);
				}
			});
			return $bgp;
		}
		//重生popId,防止id重复
		function creatPopId(){
			var i = "pop_" + (new Date()).getTime()+parseInt(Math.random()*100000);//弹窗索引
			if($("#" + i).length > 0){
				return creatPopId();
			}else{
				return i;
			}
		}
	};
	
	
	//按钮类型
	$xcAlert.btnEnum = {
		ok: parseInt("0001",2), //确定按钮
		cancel: parseInt("0010",2), //取消按钮
		okcancel: parseInt("0011",2), //确定&&取消
		regist: parseInt("0100",2),//注册
		Login: parseInt("1000",2),//登录
		Rlogin: parseInt("1100",2)//注册与登录
	};
	
	//触发事件类型
	$xcAlert.eventEnum = {
		ok: 1,
		cancel: 2,
		close: 3,
		regist: 4,
		Login: 8
	};
	
	//弹窗类型
	$xcAlert.typeEnum = {
		info: "info",
		success: "success",
		error:"error",
		confirm: "confirm",
		warning: "warning",
		input: "input",
		custom: "custom",
		warningOk :"warningOk"
	};

})(jQuery);