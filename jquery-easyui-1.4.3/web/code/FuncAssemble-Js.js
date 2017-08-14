'use strict';
/**
 * 删掉所有cookie的值
 */
function clearAllCookie() {
    //获取所有Cookie，并把它变成数组  
    var cookies = document.cookie.split(";");  
    //循环每一个数组项，把expires设置为过去时间，这样很容易地消除了所有Cookie  
    for (var i = 0; i < cookies.length; i++) {  
        var cookie = cookies[i];  
        var eqPos = cookie.indexOf("=");  
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;  
        name = name.replace(/^\s*|\s*$/, "");//清除Cookie里的空格
//        if(name == "un" || name == "pw" || name == "rmb"){
//        	continue;
//        }
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"  
    }  
      
}

/**
 * 获取浏览器的语言
 */
var getNavLanguage = function(){
		var exploreName = navigator.appName, navLanguage = null;
		switch (exploreName){
			case 'Netscape' :
				navLanguage = navigator.language;
				break;
			case 'Microsoft Internet Explorer' :
				navLanguage = navigator.userLanguage;
				break;
			default :
				navLanguage = 'zh-CN';
				break;
		}
		 return navLanguage.substr(0,2);
	}

/**
 * 记忆最后访问页面，然后在有cookie的情况下直接登陆，然后跳转到上次访问页面
 */
//当前页面
localStorage.lastRequestPage = window.location.href;
if (getCookie('userInfo') && localStorage.lastRequestPage && localStorage.lastRequestPage.indexOf('login') == -1 && getCookie('access-token')) {
	location.href = localStorage.lastRequestPage;
}

/**
 * 这里是图片属性的一个小技巧，在给img元素src属性赋值的时候，就会获取相应地址的资源。
 * 获取验证码时候比较好用
 */
function refCode(){
	$('#verify img').attr('src', contextPath + '/graph/verify-code.code?module_name=login-login&ts=' + makeStamp(new Date()));
}

/**
 * url 加密
 * @param {Object} str
 * @param {Object} pwd
 */
function Encrypt(str, pwd) {   
    if(str=="")return "";   
    str = escape(str);   
    if(!pwd || pwd==""){ var pwd="1234"; }   
    pwd = escape(pwd);   
      if(pwd == null || pwd.length <= 0) {   
        alert("Please enter a password with which to encrypt the message.");   
          return null;   
      }   
      var prand = "";   
      for(var I=0; I<pwd.length; I++) {   
        prand += pwd.charCodeAt(I).toString();   
      }   
      var sPos = Math.floor(prand.length / 5);   
      var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));   
      var incr = Math.ceil(pwd.length / 2);   
      var modu = Math.pow(2, 31) - 1;   
      if(mult < 2) {   
        alert("Algorithm cannot find a suitable hash. Please choose a different password. /nPossible considerations are to choose a more complex or longer password.");   
        return null;   
      }   
      var salt = Math.round(Math.random() * 1000000000) % 100000000;   
      prand += salt;   
      while(prand.length > 10) {   
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();   
      }   
      prand = (mult * prand + incr) % modu;   
    var enc_chr = "";   
    var enc_str = "";   
    for(var I=0; I<str.length; I++) {   
        enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));   
        if(enc_chr < 16) {   
            enc_str += "0" + enc_chr.toString(16);   
        }else   
            enc_str += enc_chr.toString(16);   
        prand = (mult * prand + incr) % modu;   
    }   
      salt = salt.toString(16);   
      while(salt.length < 8)salt = "0" + salt;   
    enc_str += salt;   
    return enc_str;   
}   
/**
 * url解密
 * @param {Object} str
 * @param {Object} pwd
 */
function Decrypt(str, pwd) {   
    if(str=="")return "";   
    if(!pwd || pwd==""){ var pwd="1234"; }   
    pwd = escape(pwd);   
      if(str == null || str.length < 8) {   
        alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");   
        return;   
      }   
      if(pwd == null || pwd.length <= 0) {   
        alert("Please enter a password with which to decrypt the message.");   
        return;   
      }   
      var prand = "";   
      for(var I=0; I<pwd.length; I++) {   
        prand += pwd.charCodeAt(I).toString();   
      }   
      var sPos = Math.floor(prand.length / 5);   
      var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));   
      var incr = Math.round(pwd.length / 2);   
      var modu = Math.pow(2, 31) - 1;   
      var salt = parseInt(str.substring(str.length - 8, str.length), 16);   
      str = str.substring(0, str.length - 8);   
      prand += salt;   
      while(prand.length > 10) {   
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();   
      }   
      prand = (mult * prand + incr) % modu;   
      var enc_chr = "";   
      var enc_str = "";   
    for(var I=0; I<str.length; I+=2) {   
        enc_chr = parseInt(parseInt(str.substring(I, I+2), 16) ^ Math.floor((prand / modu) * 255));   
        enc_str += String.fromCharCode(enc_chr);   
        prand = (mult * prand + incr) % modu;   
    }   
    return unescape(enc_str);   
}   


var port = window.location.port;//获取项目路径端口号

/**
 * Timstamp 函数
 * makeStamp(new Date());
 * "20170814134417477"
 */

function makeStamp(d) { // Date d
	var y = d.getFullYear(), M = d.getMonth() + 1, D = d.getDate(), h = d
			.getHours(), m = d.getMinutes(), s = d.getSeconds(), ss = d
			.getMilliseconds(),

	pad = function(x) {
		x = x + '';
		if (x.length === 1) {
			return '0' + x;
		}
		return x;
	};
	return y + pad(M) + pad(D) + pad(h) + pad(m) + pad(s) + pad(ss);
}

/**
 * 
 * @functionName: getPageName
 * @Description: get page name from URL 
 *   
 * 
 */
function getPageName() {
	var pathname = window.location.pathname;
	if (pathname) {
		pathname = pathname.split('/');
		return pathname[pathname.length - 1].split('.')[0];
	} else {
		return '';
	}
}

/**
 * 
 * @functionName: getOS
 * @Description: get operating system 
 *   
 * 
 */
function getOS() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('windows nt 6.3') != -1) {
		return 'Windows 8';
	} else if (ua.indexOf('windows nt 6.1') != -1) {
		return 'Windows 7';
	} else if (ua.indexOf('windows nt 6.0') != -1) {
		return 'Windows Vista';
	} else if (ua.indexOf('windows nt 5.2') != -1) {
		return 'Windows 2003';
	} else if (ua.indexOf('windows nt 5.1') != -1) {
		return 'Windows XP';
	} else if (ua.indexOf('windows nt 5.0') != -1) {
		return 'Windows 2000';
	} else if (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1) {
		return 'Windows';
	} else if (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1) {
		return 'Macintosh';
	} else if (ua.indexOf('adobeair') != -1) {
		return 'Adobeair';
	} else if (ua.indexOf('linux') != -1) {
		return 'Linux';
	} else if (ua.indexOf('iphone') != -1) {
		return 'iPhone';
	} else if (ua.indexOf('ipad') != -1) {
		return 'iPad';
	} else if (ua.indexOf('android') != -1) {
		return 'Android';
	} else {
		return 'Unknow';
	}
}

/**
 * 
 * @functionName: getNavigator
 * @Description: get navigator 
 *   
 * 
 */
function getNavigator() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf('chrome') != -1) {
		return 'Chrome';
	} else if (ua.indexOf('firefox') != -1) {
		return 'Firefox';
	} else if (ua.indexOf('safari') != -1) {
		return 'Safari';
	} else if (ua.indexOf('opera') != -1) {
		return 'Opera';
	} else if(ua.indexOf('trident') != -1 && ua.indexOf('rv:11') != -1) {
		return 'IE 11.0';
	} else if (ua.indexOf('msie 10.0') != -1) {
		return 'IE 10.0';
	} else if (ua.indexOf('msie 9.0') != -1) {
		return 'IE 9.0';
	} else if (ua.indexOf('msie 8.0') != -1) {
		return 'IE 8.0';
	} else {
		return 'Unknow';
	}
}

/**
 * 
 * @functionName: isPC
 * @Description: 判断使用设备是否为PC 
 *   
 * 
 */
function isPC() {    
    var userAgentInfo = navigator.userAgent;  
    var agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');    
    var flag = true;    
    for (var v = 0; v < agents.length; v++) {    
        if (userAgentInfo.indexOf(agents[v]) > 0) {
        	flag = false; 
        	break;
        }    
    }    
    return flag;    
 }

/**
 * 
 * @functionName: getParameter
 * @Description: get parameter from URL 
 *   
 * 
 */
function getParameter(name) {
	var search = location.search;
	if(!search) {
		return false;
	}
	search = search.split('?')
	var data = search[1].split('=');
	if(search[1].indexOf(name) == (-1)) {
	    return '';
	    return;
	}
	if(search[1].indexOf('&') == (-1)) {
	    data = search[1].split('=');
	    return data[1];
	} else {
	    data = search[1].split('&'); 
	    for(var i = 0; i <= data.length - 1; i++){
	    	var l_data=data[i].split('=');
	        if(l_data[0] == name) {
	        	return l_data[1];
	        	break;
	        } else {
	        	continue;
	        }
	    }
	}
}

/**
 * 
 * @functionName: setParameter
 * @Description: set parameter to URL 
 *   
 * 
 */
function setParameter() {
	if (arguments.length >= 1) {
		var url = arguments[0], paramsObj = arguments[1];
		if (paramsObj) {
			var parameter = '';
			for (var x in paramsObj) {
				parameter += x + '=' + paramsObj[x] + '&';
			}
			url += '?' + parameter.substr(0, parameter.length - 1);
		}
		return url;
	} else {
		$xcAlert("setParameter : 参数错误, 支持2个参数(url-必填, paramsObj)", $xcAlert.typeEnum.error);
	}
}

/**
 * 
 * @functionName: trim
 * @Description: 由于IE8不支持trim方法，此处自定义 
 *   
 * 
 */
String.prototype.trim = function() {  
    return this.replace(/(^\s*)|(\s*$)/g, '');  
}

/**
 * @functionName: setCookie
 * @Description: set cookies 
 *   
 */
function setCookie(name, value, days) { 
	var len = arguments.length; 
	if (len == 2) {
	    var exp = new Date(); 
	    exp.setTime(exp.getTime() + 30*24*60*60*1000); 
	    document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString() + ';path=/'; 
	} else if (len == 3) {
		var exp = new Date();
		exp.setDate(exp.getDate() + parseInt(days));
		exp.setHours(1, 0, 0, 0);
		document.cookie = name + '=' + escape (value) + ';expires=' + exp.toGMTString() + ';path=/';
	} else {
		$xcAlert("SetCookie参数错误!", $xcAlert.typeEnum.error);
	}
} 

/**
 * 
 * @functionName: getCookie
 * @Description: get cookies 
 *   
 * 
 */
function getCookie(name) { 
    var arr,reg=new RegExp('(^| )'+name+'=([^;]*)(;|$)');
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
} 

/**
 * 
 * @functionName: jumpBack
 * @Description: 从详情页跳回
 *   
 * 
 */
function jumpBack(destination) {
	var from = getParameter('from');
	if (!from || from == destination) {
		window.location.href = destination + '.html';
	} else {
	    window.close();
	}
}

/**
 * 
 * @functionName: delCookie
 * @Description: delete cookies 
 *   
 * 
 */
function delCookie(name) { 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval = getCookie(name); 
    if(cval != null) 
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'; 
}

/**
 * 
 * @functionName: serializeObject
 * @Description: form序列化成object
 *   
 * @param: form
 */
var serializeObject = function() {
	if (arguments.length === 1) {
		var form = arguments[0], o = {};
		$.each(form.serializeArray(), function(index) {
			if (o[this['name']]) {
				o[this['name']] = o[this['name']] + ',' + this['value'].trim();
			} else {
				o[this['name']] = this['value'].trim();
			}
		});
		return o;
	} else {
		$xcAlert("serializeObject : 参数错误, 支持1个参数(form)", $xcAlert.typeEnum.error);
	}
};


/**
 * @functionName: downloadByForm
 * @Description: form表单下载文件
 *    * @param: option {
 * 			url, 
 * 			param, 
 * 			button, 
 * 			callback: 选填, 是否有回调函数, 值 true|false
 * 			success: 选填, 回调函数, 值 function
 * 		}
 * 使用方法：
 *  queryParam = new Object();
 *  downloadByForm({url : '接口路径', param : queryParam, button : this, callback : true, success : function() {
		 todo...
	}});
	注意:下载文件除了这个方法，还有就是直接写接口路径，然后可以直接下载excel等文件.location.href="接口路径"
 */
function downloadByForm() {
	if (arguments.length === 1) {
		var option = arguments[0], url = option.url, param = option.param, button = option.button, orgText = $(button).text();
//		var url = arguments[0], param = arguments[1], button = arguments[2], orgText = $(button).text();
		$(button).addClass('btnDisabled');
		$(button).attr('disabled', true);
		if (!(typeof button === 'string')) {
			button = '#' + button.id;
		}
			
		if (option.callback) {
	    	param.process_id = makeStamp(new Date());
	  } else {
		  if (!$(button).hasClass('btnImg')) {
			  $(button).text('下载中...');
			  setTimeout("$('" + button + "').text('" + orgText + "'); $('" + button + "').removeClass('btnDisabled'); $('" + button + "').attr('disabled', false);", 2000);
		  } else {
			  var buttonHoverTitle = $(button).parent().next();
			  buttonHoverTitle.html('<p style="left: ' + ($(button).offset().left - buttonHoverTitle.offset().left - 2) + 'px;">下载中...</p>');
			  setTimeout(function() {
				  $(button).parent().next().html('');
				  $(button).removeClass('btnDisabled'); 
				  $(button).attr('disabled', false);
			  }, 2000);
		  }
	  }
		 
		var form = $('<form>');
	    form.attr('style', 'display:none');
	    form.attr('target', 'downloadFrame');
	    form.attr('method', 'get');
	    form.attr('action', contextPath + url);
//	    form.attr('id', 'form');
	    
	    $('body').append(form);
	    for (var x in param) {
	    	var input = $('<input>'); 
	        input.attr('type', 'hidden'); 
	        input.attr('name', x); 
	        input.attr('value', param[x]); 
	        form.append(input);
	    }
	    form.submit();
	    if (option.callback) {
	    	 if (!$(button).hasClass('btnImg')) {
	    		 $(button).text('处理中...');
			 } else {
				 var buttonHoverTitle = $(button).parent().next();
				 buttonHoverTitle.html('<p style="left: ' + ($(button).offset().left - buttonHoverTitle.offset().left - 2) + 'px;">处理中...</p>');
			 }
	    	setTimeout(function() {
	    		var getProcessStatusCount = 0,
	    		getProcessStatusInterval = setInterval(function() {
		    		$.post(contextPath + '接口路径', {process_id : param.process_id}, function(res) {
			    		if (res.errCd === 0) {
			    			var result = res.result;
			    			if (result) {
			    				if (result.success) {
			    					if (!$(button).hasClass('btnImg')) {
			    			    		 $(button).text('下载中...');
			    			    		 setTimeout("$('" + button + "').text('" + orgText + "'); $('" + button + "').removeClass('btnDisabled'); $('" + button + "').attr('disabled', false);", 2000);
			    					} else {
			    						var buttonHoverTitle = $(button).parent().next();
			    						 buttonHoverTitle.html('<p style="left: ' + ($(button).offset().left - buttonHoverTitle.offset().left - 2) + 'px;">下载中...</p>');
			    						 setTimeout(function() {
			    							  $(button).parent().next().html('');
			    							  $(button).removeClass('btnDisabled'); 
			    							  $(button).attr('disabled', false);
			    						  }, 2000);
			    					}
									if (option.success instanceof Function) {
										option.success();
									}
									clearInterval(getProcessStatusInterval);
			    				} else {
			    					if (getProcessStatusCount === 149) {
			    						clearInterval(getProcessStatusInterval);
			    					} else {
			    						getProcessStatusCount += 1;
			    					}
			    				}
			    			}
			    		} else {
			    			$xcAlert(res.errMsg, $xcAlert.typeEnum.error);
			    		}
			    	});
	    		}, 2000);
	    	}, 500);
	  	}
	} else {
		$xcAlert("downloadByForm : 参数错误, 支持1个参数(option{url, param, button, callback-选填, success-选填})", $xcAlert.typeEnum.error);
	}
}

/**
 * @functionName: downloadByJS
 * @Description: js实现数据下载，不向服务器发请求，纯前台处理实现下载
 *   
 * @param: option {
 * 			filename,  必填
 * 			content,   必填
 * 			target     必填
 * 		}
 */
function downloadByJS () {
	var option = arguments[0], filename = option.filename, content = option.content, target = option.target;
	if (getNavigator().indexOf('IE') > -1) {
    	if (!$('iframe[name="downloadFrame"]').length) {
    		$('body').append('<iframe frameborder="0" height="0" name="downloadFrame"></iframe>');
    	}
    	var tempDoc = $('iframe[name="downloadFrame"]')[0].contentWindow.document;
    	tempDoc.write(content);
    	tempDoc.close();
    	tempDoc.execCommand('Saveas', true, filename);
    	tempDoc.write('');
    	tempDoc.close();
    } else {
    	var blob = new Blob([content], { type: 'text/xls,charset=UTF-8'});
    	target.download = filename;
    	target.href = URL.createObjectURL(blob);
    }
}

/**
 * 
 * @functionName: formatDate
 * @Description: 格式化Date对象
 *   
 * @param: date, symbol-选填
 */
function formatDate() {  
	if (arguments.length > 0 && arguments.length < 3) {
		var date = arguments[0], symbol = (arguments[1] ? arguments[1] : '-');
		if (!date) {
			return '';
		}
		if (!(date instanceof Date)) {
			date = date.split(/\s/)[0].split('-');
			date = new Date(date[0], parseInt(date[1]) - 1, date[2]);
		}
		var year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		return year + symbol +  month + symbol + day;
	} else {
		$xcAlert("formatDate : 参数错误, 支持2个参数(date, symbol-选填)", $xcAlert.typeEnum.error);
	}
}

/**
 * 
 * @functionName: formatTime
 * @Description: 格式化Date对象的time
 *   
 * @param: date
 */
function formatTime() {
	if (arguments.length === 1) {
		var date = arguments[0];
		if (!date) {
			return '';
		}
		if (!(date instanceof Date)) {
			date  = date.split(/\s/);
			if (!date[1]) {
				return '';
			}
			var time = date[1].split(':');
			if (!time[2]) {
				time[2] = '00';
			}
			date = date[0].split('-');
			date = new Date(date[0], parseInt(date[1]) - 1, date[2], time[0], time[1], time[2]);
		}
		var hour = date.getHours(), minute = date.getMinutes(), second = date.getSeconds();
		hour = hour < 10 ? '0' + hour : hour;
		minute = minute < 10 ? '0' + minute : minute;
		second = second < 10 ? '0' + second : second;
		return hour + ':' +  minute + ':' + second;
	} else {
		$xcAlert("formatTime : 参数错误, 支持1个参数(date)", $xcAlert.typeEnum.error);
	}
}

/**
 * 
 * @functionName: formatDay
 * @Description: 根据浏览器语言格式化Date对象的day
 *   
 * @param: date
 */
function formatDay() {  
	if (arguments.length === 1) {
		var date = arguments[0];
		if (!date) {
			return '';
		}
		if (!(date instanceof Date)) {
			date = date.split(/\s/)[0].split('-');
			date = new Date(date[0], parseInt(date[1]) - 1, date[2]);
		}
		var lang = navigator.language, day = date.getDay();
		lang = lang ? lang : navigator.systemLanguage;
		lang ? lang = lang.toLowerCase() : '';
		switch (lang) {
			case 'zh-cn':
				switch (day) {
					case 0:
						return '周日';
						break;
					case 1:
						return '周一';
						break;
					case 2:
						return '周二';
						break;
					case 3:
						return '周三';
						break;
					case 4:
						return '周四';
						break;
					case 5:
						return '周五';
						break;
					case 6:
						return '周六';
						break;
				}
				break;
			case 'ja-jp':
				switch (day) {
					case 0:
						return '日曜日';
						break;
					case 1:
						return '月曜日';
						break;
					case 2:
						return '火曜日';
						break;
					case 3:
						return '水曜日';
						break;
					case 4:
						return '木曜日';
						break;
					case 5:
						return '金曜日';
						break;
					case 6:
						return '土曜日';
						break;
				}
				break;
			default : 
				switch (day) {
					case 0:
						return 'Sun.';
						break;
					case 1:
						return 'Mon.';
						break;
					case 2:
						return 'Tue.';
						break;
					case 3:
						return 'Wed.';
						break;
					case 4:
						return 'Thu.';
						break;
					case 5:
						return 'Fri.';
						break;
					case 6:
						return 'Sat.';
						break;
				}
				break;
		}
	} else {
		$xcAlert("formatTime : 参数错误, 支持1个参数(date)", $xcAlert.typeEnum.error);
	}
}

/**
 * 
 * @functionName: objToStr
 * @Description: 将JSON转换为String, 作为参数传进函数
 *   
 * @param: obj
 * flag_nbsp:是否将空格转化为&nbsp;有的时候，在项目中，在json字符串中如果转化为nbsp，会导致解析错误的
 * 当flag_nbsp为false时。序列化字符串的时候，不将空格转化为&nbsp
 */
function objToStr(obj, flag_nbsp) {
	if (arguments.length === 1) {
		for(var key in obj) {
			if (typeof(obj[key]) === 'string' && obj[key].indexOf('[') > -1) {
				obj[key] = obj[key].replace(/\\\"/g, '\"');
				obj[key] = obj[key].replace(/\"/g, '\\\"');
			}
		}
		return flag_nbsp == true ? JSON.stringify(obj).replace(/\s/g, '&nbsp;') || JSON.stringify(obj);
	} else {
		$xcAlert("objToStr : 参数错误, 支持1个参数(obj)", $xcAlert.typeEnum.error);
	}
}
/**
 * 
 * @functionName: myRequest
 * @Description: 所有请求可以使用的通用方法
 * @author: Dai
 * @param: paramObj, url
 */
function myRequest(paramObj, url){
	var result = '';
 	$.ajax({
	 	type : 'post',
	 	url : contextPath + url,
	 	data : paramObj,
	 	async : false,
	 	cache : false,
	 	dataType : 'json',
	 	success : function(data) {
	 		if (data.errCd === 0) {
	 			if (data.result) {
	 				result = data.result;
	 			}
	 		} else {
	 			$xcAlert(data.errMsg, $xcAlert.typeEnum.error);
	 		}
	 	},
	 	error : function(){
	 		$xcAlert("发生错误", $xcAlert.typeEnum.error);
	 	}
 	});
	return result;
}

// 处理键盘事件
//禁止后退键（Backspace）密码或单行、多行文本框除外

function banKeyEvent(e) {
	var ev = e || window.event;// 获取event对象
	var obj = ev.target || ev.srcElement;// 获取事件源
	var t = obj.type || obj.getAttribute('type');// 获取事件源类型
   
   // 获取作为判断条件的事件类型
   var vReadOnly = obj.getAttribute('readonly');
   var vEnabled = obj.getAttribute('enabled');
   // 处理null值情况
   var userAgent = navigator.userAgent.toLowerCase();
   var rMsie = /(msie\s|trident.*rv:)([\w.]+)/;
   var match = rMsie.exec(userAgent);  
   if (match !== null) {
    	if(parseInt(match[2]) === 8) //IE 8.0 
    		vReadOnly = (vReadOnly === '') ? null : vReadOnly;
   }
   vReadOnly = (vReadOnly === null) ? false : true;
   vEnabled = (vEnabled === null) ? true : vEnabled;
   
   // 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
   // 并且readonly属性为true或enabled属性为false的，则退格键失效
   var flag1 = (ev.keyCode === 8 && (t === 'password' || t === 'text' || t === 'textarea') && (vReadOnly === true || vEnabled !== true)) ? true : false;

   // 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
// var flag2 = (ev.keyCode === 8 && t !== 'password' && t !== 'text' && t !== 'textarea') ? true : false;
   
   // 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
   var flag2 = (ev.keyCode === 8 && obj.tagName !== 'INPUT' && obj.tagName !== 'TEXTAREA') ? true : false;
   
   // 判断
   if (flag1) {
       return false;
   }
   if (flag2) {
       return false;
   }
   
}
/**
 * 
 * @functionName: formatDateEasyUI
 * @Description: 页面中起始终止时间格式化
 * @author: haliluya
 * @param: date
 * @desc ：2017-1-19 09:37:41
 */
function formatDateEasyUI(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	return m + '/' + d + '/' + y;
}
/**
 * 
 * @functionName: formatDateEasyUIHMS
 * @Description: 页面中起始终止时间格式化时分秒
 * @author: haliluya
 * @param: date
 * @desc ：2017-1-19 09:37:34
 */
function formatDateEasyUIHMS(date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours()+1;
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return m + '/' + d + '/' + y+' '+(h<10?('0'+h):h)+':'+(mi<10?('0'+mi):mi)+':'+(s<10?('0'+s):s);
}
/**
 * 
 * @functionName: formatDateEasyUIHMS
 * @Description: 页面中起始终止时间格式化时分秒yy-mm-dd
 * @author: haliluya
 * @param: date
 * @desc ： 2017-1-19 09:37:28
 */
function getCurrentTimeHMS(d,num){
	var str = '';
	var newDay = null;
	d.setDate(d.getDate()+num);	
	str += formatDate(d) + ' ';
	str +=((d.getHours()>9)?d.getHours():("0"+d.getHours()))+':';
	str +=((d.getMinutes()>9)?d.getMinutes():("0"+d.getMinutes()))+':';
	str +=((d.getSeconds()>9)?d.getSeconds():("0"+d.getSeconds()));
	return str;
}
//禁止后退键
//作用于Firefox、Opera
document.onkeypress = banKeyEvent;
//禁止后退键
//作用于IE、Chrome
document.onkeydown = banKeyEvent;

//页面回到顶部 
var scrolltotop={
		setting:{
			startline:100, //起始行
			scrollto:0, //滚动到指定位置
			scrollduration:400, //滚动过渡时间
			fadeduration:[500,100] //淡出淡现消失
		},
		controlHTML:'<img src="../lib/img/images/topback.gif" style="width:45px; height:45px; border:0; " />', //返回顶部按钮
		controlattrs:{offsetx:0,offsety:115},//返回按钮固定位置
		anchorkeyword:"#top",
		state:{
			isvisible:false,
			shouldvisible:false
		},scrollup:function(){
			if(!this.cssfixedsupport){
				this.$control.css({opacity:0});
			}
			var dest=isNaN(this.setting.scrollto)?this.setting.scrollto:parseInt(this.setting.scrollto);
			if(typeof dest=="string"&&jQuery("#"+dest).length==1){
				dest=jQuery("#"+dest).offset().top;
			}else{
				dest=0;
			}
			this.$body.animate({scrollTop:dest},this.setting.scrollduration);
		},keepfixed:function(){
			var $window=jQuery(window);
			var controlx=$window.scrollLeft()+$window.width()-this.$control.width()-this.controlattrs.offsetx;
			var controly=$window.scrollTop()+$window.height()-this.$control.height()-this.controlattrs.offsety;
			this.$control.css({left:controlx+"px",top:controly+"px"});
		},togglecontrol:function(){
			var scrolltop=jQuery(window).scrollTop();
			if(!this.cssfixedsupport){
				this.keepfixed();
			}
			this.state.shouldvisible=(scrolltop>=this.setting.startline)?true:false;
			if(this.state.shouldvisible&&!this.state.isvisible){
				this.$control.stop().animate({opacity:1},this.setting.fadeduration[0]);
				this.state.isvisible=true;
			}else{
				if(this.state.shouldvisible==false&&this.state.isvisible){
					this.$control.stop().animate({opacity:0},this.setting.fadeduration[1]);
					this.state.isvisible=false;
				}
			}
		},init:function(){
			jQuery(document).ready(function($){
				var mainobj=scrolltotop;
				var iebrws=document.all;
				mainobj.cssfixedsupport=!iebrws||iebrws&&document.compatMode=="CSS1Compat"&&window.XMLHttpRequest;
				mainobj.$body=(window.opera)?(document.compatMode=="CSS1Compat"?$("html"):$("body")):$("html,body");
				mainobj.$control=$('<div id="topcontrol">'+mainobj.controlHTML+"</div>").css({position:mainobj.cssfixedsupport?"fixed":"absolute",bottom:mainobj.controlattrs.offsety,right:mainobj.controlattrs.offsetx,opacity:0,cursor:"pointer"}).attr({title:"返回顶部"}).click(function(){mainobj.scrollup();return false;}).appendTo("body");if(document.all&&!window.XMLHttpRequest&&mainobj.$control.text()!=""){mainobj.$control.css({width:mainobj.$control.width()});}mainobj.togglecontrol();
				$('a[href="'+mainobj.anchorkeyword+'"]').click(function(){mainobj.scrollup();return false;});
				$(window).bind("scroll resize",function(e){mainobj.togglecontrol();});
			});
		}
	};
	scrolltotop.init();
/**
 * 
 * @functionName: 
 * @Description: 获取url页面名称方法 
 * @author: haliluya
 * @param: date
 * @desc ： 2017-2-15 09:37:28
 */
function getPageName() {
	var pageN = window.location.pathname;
	pageN = pageN.substring(pageN.lastIndexOf("/")+1,pageN.indexOf("."));
	if(pageN) return pageN;
}
