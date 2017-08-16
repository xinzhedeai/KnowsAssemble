/**
 * 1.实际项目开发中，需要将模板菜单提取出来，通过js动态写入到html页面中
 * 2.这个模板顶部栏由于是使用bootstrap框架，导致在ie8下，显示的时候出现问题。所以需要自己写一个顶部栏
 * 
 */
var menu = $.parseJSON(localStorage.mo2menu); //登录的时候，将菜单信息存放到localStorage中
var curPageMod = localStorage.pageFlag,//当点击某个页面时，菜单相应项高亮显示，在此设定标记位
flag = 0;

	var navMenuStr = '', //定义变量，用于拼接菜单html串
	subMenuStr = '';//用于存储子菜单html串
	if(curPageMod && curPageMod != 'false'){
		flag = 1;
	}else{
		flag = 0;
	}
	if(flag == 0){//根据标记，判断此前是否是第一次进入页面，是，则默认展开
		for(var i=0,leni = menu.length; i<leni; i++){
			if(i == 0){
				navMenuStr += '<div class="sBox"><div class="subNav sublist-up"><span class="title-icon glyphicon glyphicon-chevron-up"></span><span class="sublist-title">';
				navMenuStr += menu[i].title;
				navMenuStr += '</span></div>';
				navMenuStr += '<ul class="navContent" style="display:block">';
			}else {
				navMenuStr += '<div class="sBox"><div class="subNav sublist-down"><span class="title-icon glyphicon glyphicon-chevron-down"></span><span class="sublist-title">';
				navMenuStr += menu[i].title;
				navMenuStr += '</span></div>';
				navMenuStr += '<ul class="navContent" style="display:none">';
			}
			for(var j=0, lenj = menu[i].subMenu.length; j<lenj; j++){
				if(j == 0){
					navMenuStr += '	<li class=""><div class="showtitle" style="width:100px;"><img src="../lib/img/images/leftimg.png" />' + menu[i].subMenu[j].title + '</div>';
				}else{
					navMenuStr += '	<li class=""><div class="showtitle" style="width:100px;"><img src="../lib/img/images/leftimg.png" />' + menu[i].subMenu[j].title + '</div>';
				}
				navMenuStr += '<a onclick="goBourn(\''+ menu[i].subMenu[j].link+'\',\''+ menu[i].title +'\',\''+menu[i].subMenu[j].icon+'\')" title="'+ menu[i].subMenu[j].icon +'"><img src="../lib/img/leftMenu/'+ menu[i].subMenu[j].icon +'.png"></img><span class="sub-title">' + menu[i].subMenu[j].title + '</span></a></li>';
			}
			navMenuStr += '</ul>';//二级菜单结束
			navMenuStr += '</div>';//一级菜单结束
		}
	}else{
		for(var i=0,leni = menu.length; i<leni; i++){
			if(curPageMod == menu[i].title){
				navMenuStr += '<div class="sBox"><div class="subNav sublist-up"><span class="title-icon glyphicon glyphicon-chevron-up"></span><span class="sublist-title">';
				navMenuStr += menu[i].title;
				navMenuStr += '</span></div>';
				navMenuStr += '<ul class="navContent" style="display:block">';
			}else {
				navMenuStr += '<div class="sBox"><div class="subNav sublist-down"><span class="title-icon glyphicon glyphicon-chevron-down"></span><span class="sublist-title">';
				navMenuStr += menu[i].title;
				navMenuStr += '</span></div>';
				navMenuStr += '<ul class="navContent" style="display:none">';
			}
			for(var j=0, lenj = menu[i].subMenu.length; j<lenj; j++){
				if(j == 0){
					navMenuStr += '	<li class=""><div class="showtitle" style="width:100px;"><img src="../lib/img/images/leftimg.png" />' + menu[i].subMenu[j].title + '</div>';
				}else{
					navMenuStr += '	<li class=""><div class="showtitle" style="width:100px;"><img src="../lib/img/images/leftimg.png" />' + menu[i].subMenu[j].title + '</div>';
				}
				navMenuStr += '<a onclick="goBourn(\''+ menu[i].subMenu[j].link+'\',\''+menu[i].title+'\',\''+menu[i].subMenu[j].icon+'\')" title="'+ menu[i].subMenu[j].icon +'"><img src="../lib/img/leftMenu/'+ menu[i].subMenu[j].icon +'.png"></img><span class="sub-title">' + menu[i].subMenu[j].title + '</span></a></li>';
			}
			navMenuStr += '</ul>';//二级菜单结束
			navMenuStr += '</div>';//一级菜单结束
		}
	}
	//	<div class="subNavBox"></div>页面中的左侧菜单栏节点
	$('.subNavBox').html(navMenuStr);
	
	/*左侧导航栏显示隐藏功能*/
	$("body").on('click','.subNav',function(){	
		var a = $(this).find('.sublist-title').text();
		/*显示*/
		if($(this).find("span:first-child").attr('class') == "title-icon glyphicon glyphicon-chevron-down") {
			$(this).find("span:first-child").removeClass("glyphicon-chevron-down");
			$(this).find("span:first-child").addClass("glyphicon-chevron-up");
			$(this).removeClass("sublist-down");
			$(this).addClass("sublist-up");
		}
		/*隐藏*/
		else {
			$(this).find("span:first-child").removeClass("glyphicon-chevron-up");
			$(this).find("span:first-child").addClass("glyphicon-chevron-down");
			$(this).removeClass("sublist-up");
			$(this).addClass("sublist-down"); 
		}
		// 修改数字控制速度， slideUp(500)控制卷起速度
		$(this).next(".navContent").slideToggle(300).end().parent().siblings().find(".navContent").slideUp(300);
		//箭头变换
		$(this).parent().siblings().find(".title-icon").removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
		//其他子菜单隐藏
		$(this).parent().siblings().find('.subNav ').removeClass('sublist-up').addClass('sublist-down');
	});
	

/*左侧导航栏缩进功能*/
	$(".left-main .sidebar-fold").click(function(){
		setTimeout("resizeDatagrid();");
		if($(this).parent().attr('class') == "left-main left-full") {
			$(this).parent().removeClass("left-full");
			$(this).parent().addClass("left-off");
			$(this).parent().parent().find(".right-product").removeClass("right-full");
			$(this).parent().parent().find(".right-product").addClass("right-off");
		} else {
			$(this).parent().removeClass("left-off");
			$(this).parent().addClass("left-full");
			$(this).parent().parent().find(".right-product").removeClass("right-off");
			$(this).parent().parent().find(".right-product").addClass("right-full");
		}
	});
	

  /*左侧鼠标移入提示功能*/
	$(".sBox ul li").mouseenter(function(){
		if($(this).find("span:last-child").css("display") == "none") {
			$(this).find("div").show();
		}
	}).mouseleave(function() {
		$(this).find("div").hide();
	})
	//这个是改变窗口大小时，重新自适应的方法
	$(window).resize(function() {
		setTimeout("resizeDatagrid();", 300);
	});	
	

	//添加当前所在页标志
	var pageName = getCookie('pageName'), urlPageName = getPageName();
	if(pageName){
		var $a = $('.navContent').find('a');
		if(pageName == urlPageName){
			$.each($a,function(index, field){
				if($(this).attr('title') == pageName){
					$(this).parent('li').addClass('curPageFlag').siblings('li').removeClass('curPageFlag');
				}
			})
		}else{
			$.each($a,function(index, field){
				if($(this).attr('title') == urlPageName){
					$(this).parent('li').addClass('curPageFlag').siblings('li').removeClass('curPageFlag');
					var $this = $(this).parent().parent().parent().find('.subNav');
					$this.trigger('click');
				}
			})
		}
	}else{
		var $a = $('.navContent').find('a');
		$.each($a, function(index, field){
			if($(this).attr('title') == 'companyInfo'){
				$(this).parent('li').addClass('curPageFlag').siblings('li').removeClass('curPageFlag');
			}
		})
	}
	
	//页面跳转
function goBourn(url, pageFlag, pageName){
	if($('.left-main').is('.left-off')){
		localStorage.menuFlagOpen = 0;
	}else{
		localStorage.menuFlagOpen = 1;
	}
	localStorage.pageFlag = pageFlag;
	location.href = url;
	setCookie('pageName', pageName);
}

/**
 * <div class="pagesHeader">顶部栏节点</div>
 * 
 * 	var headerEle = '<div class="header-title">' +
						'<i class="fa fa-globe" style="margin: -12px 6px auto 8px;"></i><span>warehouse system</span>'+
					'</div>'+
					'<div class="header-userInfo">'+
						 '<a id="goHomePage">首页</a>'+
						 '<a href="../../basic/userDetail.html">'+ userInfo.user_id +'</a>'+
			    		 '<a id="logout">登出系统</a>'+
					'</div>';
 
 $('.pagesHeader').html(headerEle);将顶部栏动态写入html页面中
 */