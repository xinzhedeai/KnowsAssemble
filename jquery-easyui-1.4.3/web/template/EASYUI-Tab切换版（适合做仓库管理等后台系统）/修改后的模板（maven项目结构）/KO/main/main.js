var index_tabs, index_tabsMenu;
$(function() {
	index_tabs = $('#index_tabs').tabs({
		tabHeight: 44,
		fit: true,
		border: false,
		onContextMenu: function(e, title) {
			e.preventDefault();
			index_tabsMenu.menu('show', {
				left: e.pageX,
				top: e.pageY
			}).data('tabTitle', title);
		},
		/*onSelect:function(title, index){ 
		   var $currentTab = $(this).tabs("getSelected"); 
		   if($currentTab.find("iframe") && $currentTab.find("iframe").size()){
			  $currentTab.find("iframe").attr("src", $currentTab.find("iframe").attr("src"));
		   }
		}*/
	});

	index_tabsMenu = $('#index_tabsMenu').menu({
		onClick: function(item) {
			var curTabTitle = $(this).data('tabTitle');
			var type = $(item.target).attr('title');
			if(type === 'refresh') {
				var $currentTab = index_tabs.tabs('getTab', curTabTitle);
				//				index_tabs.tabs('getTab', curTabTitle).panel('refresh');
				$currentTab.find("iframe").attr("src", $currentTab.find("iframe").attr("src"));
				return;
			}
			if(type === 'close') {
				var t = index_tabs.tabs('getTab', curTabTitle);
				if(t.panel('options').closable) {
					index_tabs.tabs('close', curTabTitle);
				}
				return;
			}
			var allTabs = index_tabs.tabs('tabs');
			var closeTabsTitle = [];
			$.each(allTabs, function() {
				var opt = $(this).panel('options');
				if(opt.closable && opt.title != curTabTitle && type === 'closeOther') {
					closeTabsTitle.push(opt.title);
				} else if(opt.closable && type === 'closeAll') {
					closeTabsTitle.push(opt.title);
				}
			});

			for(var i = 0; i < closeTabsTitle.length; i++) {
				index_tabs.tabs('close', closeTabsTitle[i]);
			}
		}
	});

	$('.sider-nav').on('click', '.sider-nav-s a', function() {
		addTab({
			url: $(this).attr('data-href'),
			title: $(this).text(),
		});
	});

	$(document).on('click', '.sider-nav > li', function() { //左侧菜单点击展开事件
		$(this).siblings().removeClass('current').end().addClass('current');
		$('iframe').attr('src', $(this).data('src'));
	});

	$(document).on('mouseenter', '.sider-nav-s > li', function() {
		$(this).addClass('pulse').siblings().removeClass('pulse');
	});

	$(document).on('click', '.sider-nav-s > li', function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//	var str = '[{"title_ko":"기본 정보","title":"基本信息","title_jp":"基本情報","link":"/basicInfo","subMenu":[{"title_ko":"회사 정보","menu_id":"463b654c9f8e447ba6643528c2c2225d","icon":"companyInfo","title":"公司信息","title_jp":"会社のメッセージ","link":"/basicInfo/companyInfo.html"},{"title_ko":"일본 우편","menu_id":"25bf86887412469ea5257dc3191287cf","icon":"jpZip","title":"日本邮编","title_jp":"日本邮编","link":"/basicInfo/jpZip.html"},{"title_ko":"항공 편 정보","menu_id":"3db045c8f18341e699d784caee827d35","icon":"flightInfo","title":"航班信息","title_jp":"便情報","link":"/basicInfo/flightInfo.html"},{"title_ko":"설비 정보","menu_id":"e7617bb66b564c44bf11ba64f3111e3b","icon":"equipInfo","title":"设备信息","title_jp":"設備情報","link":"/basicInfo/equipInfo.html"},{"title_ko":"배송 정보","menu_id":"4c6863c4652f4f2abe431c648b90506e","icon":"expressInfo","title":"快递信息","title_jp":"宅配情報","link":"/basicInfo/expressInfo.html"},{"title_ko":"메뉴 관리","menu_id":"c14c437c44fb42d39363261a4f55fc35","icon":"menuManage","title":"菜单管理","title_jp":"メニュー管理","link":"/basicInfo/menuManage.html"},{"title_ko":"api 관리","menu_id":"5dccf7791ba0421cb47d1304564d856e","icon":"apiManage","title":"api管理","title_jp":"api管理","link":"/basicInfo/apiManage.html"},{"title_ko":"사전 관리","menu_id":"120841f5504449319d156ff9d436a00b","icon":"dictManage","title":"字典管理","title_jp":"辞书管理","link":"/basicInfo/dictManage.html"}]},{"title_ko":"화물 관리","title":"货物管理","title_jp":"貨物管理","link":"/cargo","subMenu":[{"title_ko":"화물 추적","menu_id":"0471fea5fe5141b39a9a5a9b1b78264f","icon":"cargoTrack","title":"货物追踪","title_jp":"貨物追跡","link":"/cargo/cargoTrack.html"},{"title_ko":"항공 검색","menu_id":"acd9a448f01946d9a28fcff183da5dac","icon":"flightSearch","title":"航单搜索","title_jp":"航単検索","link":"/cargo/flightSearch.html"}]},{"title_ko":"통관 관리","title":"通关管理","title_jp":"通関管理","link":"/clearance","subMenu":[{"title_ko":"mawb","menu_id":"e12a40ed5f96411abfd169b863b50e0c","icon":"mawb","title":"mawb","title_jp":"mawb","link":"/clearance/mawb.html"},{"title_ko":"허락 정보","menu_id":"a64e2ec3d8e74cd29014b45fcf7afcf7\r\n","icon":"licenseInfo","title":"许可信息","title_jp":"許可情報","link":"/clearance/licenseInfo.html"},{"title_ko":"신고 정보","menu_id":"d2323b1c4678499da09b9125f09d6acd","icon":"reportInfo","title":"申报信息","title_jp":"申告情報","link":"/clearance/reportInfo.html"}]},{"title_ko":"배송 관리","title":"配送管理","title_jp":"配送管理","link":"/delivery","subMenu":[{"title_ko":"배송 정보","menu_id":"f5e63030a5bf4c0e8d96f42769d822ec","icon":"deliveryInfo","title":"配送信息","title_jp":"配送情報","link":"/delivery/deliveryInfo.html"}]},{"title_ko":"감시 관리","title":"监控管理","title_jp":"监视管理","link":"/monitor","subMenu":[{"title_ko":"조작 감시","menu_id":"6b718c59188a45dfb5f966bdfe0f9f81","icon":"operateMonitor","title":"操作监控","title_jp":"操作モニタリング","link":"/monitor/operateMonitor.html"}]}]';
	var str = [{
		"title": "基本信息",
		"link": "/basic",
		"subMenu": [{
			"menu_id": "86ac3be6-390a-11e7-a2af-74d02b7d5f71",
			"icon": "role",
			"title": "角色信息",
			"link": "/basic/role.html"
		}]
	}];

	localStorage.setItem('menu', str);
	var p = '';
	/**
	 * 
	 */
	//		var menu = $.parseJSON(localStorage.getItem('menu'));
	//这里有个疑问，就是localstorage存储的 是json字符串,就是上面数组收尾各家一个双引号，正常来说可以解析的，但是在下面的
	//$.parseJSON()里面就不好使，在mo-v2测试项目里明明是好使的。。。到底怎么回事，以后研究一下
	var menu = str;
	for(var i = 0; i < menu.length; i++) {
		p += i == 0 ? '<li class="current">' : '<li>'; // 默认设置菜单第一个为展开状态
		p += '<a href="javascript:;">\
				<span class="iconfont sider-nav-icon">&#xe620;</span>\
	 			<span class="sider-nav-title">' + menu[i].title + '</span>\
		 		<i class="iconfont">&#xe642;</i>\
			</a>';
		if(menu[i].subMenu && menu[i].subMenu.length > 0) {
			p += '<ul class="sider-nav-s">';
			for(var j = 0; j < menu[i].subMenu.length; j++) {
				p += j == 0 ? '<li class="active animated">' : '<li class="animated">'; // 默认设置菜单第一个为激活状态
				p += '<a data-href="..' + menu[i].subMenu[j].link + '">' + menu[i].subMenu[j].title + '</a>\
					  </li>';
			}
			p += '</ul>';
		}
		p += '</li>';
	}
	$('.sider-nav').html(p);
	$(window).resize(function() {
		$('.tabs-panels').height($("#pf-page").height() - 46);
		$('.panel-body').height($("#pf-page").height() - 76)
	}).resize();

	var page = 0,
		pages = ($('.pf-nav').height() / 70) - 1;
	if(pages === 0) {
		$('.pf-nav-prev, .pf-nav-next').hide();
	}
	$(document).on('click', '.pf-nav-prev, .pf-nav-next', function() {
		if($(this).hasClass('disabled'))
			return;
		if($(this).hasClass('pf-nav-next')) {
			page++;
			$('.pf-nav').stop().animate({
				'margin-top': -70 * page
			}, 200);
			if(page == pages) {
				$(this).addClass('disabled');
				$('.pf-nav-prev').removeClass('disabled');
			} else {
				$('.pf-nav-prev').removeClass('disabled');
			}
		} else {
			page--;
			$('.pf-nav').stop().animate({
				'margin-top': -70 * page
			}, 200);
			if(page == 0) {
				$(this).addClass('disabled');
				$('.pf-nav-next').removeClass('disabled');
			} else {
				$('.pf-nav-next').removeClass('disabled');
			}
		}
	})

	$('.pf-logout').click(function() { //安全退出
		location.href = 'login.html';
	});

	$(document).on('click', '.toggle-icon', function() { //左侧菜单收起
		$(this).closest("#pf-bd").toggleClass("toggle");
		setTimeout(function() {
			$(window).resize();
		}, 300)
	});

	$('.pf-modify-pwd').click(function() { //修改密码
		$('#pf-page').find('iframe').eq(0).attr('src', 'backend/modify_pwd.html')
	});

	// setTimeout(function(){
	// $('.tabs-panels').height($("#pf-page").height()-46);
	// $('.panel-body').height($("#pf-page").height()-76)
	// }, 200)

});

/**
 *本模板在自适应那部分还需要优化，样式也需要再调整 
 *scrolling="yes"//iframe的滚动条属性 
 * @param {Object} params
 */
function addTab(params) {
	var iframe = '<iframe src="' +
		params.url +
		'" frameborder="0" style="border:0;width:100%;height:98%;"></iframe>';
	var t = $('#index_tabs');
	var opts = {
		title: params.title,
		closable: true,
		// iconCls : params.iconCls,
		content: iframe,
		border: false,
		fit: true
	};
	if(t.tabs('exists', opts.title)) {
		t.tabs('select', opts.title);
		// parent.$.messager.progress('close');
	} else {
		t.tabs('add', opts);
	}
}