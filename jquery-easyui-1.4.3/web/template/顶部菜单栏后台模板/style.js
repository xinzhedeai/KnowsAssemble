$(function(){
	//设置menu
	var menu = localStorage.menu;
	if (menu) {
		menu = $.parseJSON(localStorage.menu);
	} else {
		window.location.href = '/login.html';
	}
	
	//设置页面title
	if (!$('.acticleTitle').text()) {
		if ($('.location span:eq(3)').text()) {
			$('.acticleTitle').text($('.location span:eq(3)').text());
		} else {
			$('.acticleTitle').text($('.location span:eq(1)').text());
		}
		
	}
	$('.leftTitle').text($('.location span:eq(1)').text());
	
	//代理公司logo
	menu.unshift({title : '&nbsp;&nbsp;projectTitle'});
	//设置上侧主菜单
	for (var x in menu) {
		var titleMenu = menu[x].title;
		if (titleMenu) {
			if (x == 0) {
				$('.menuCnm ul').append('<li class="logo" title="点击跳转到主页">' + titleMenu + '</li>');
			} else {
				$('.menuCnm ul').append('<li><a>' + titleMenu + '</a></li>');
			}
			if ($('.location span:eq(1)').text() === titleMenu) {
				$('.menuCnm ul li:last-child a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
				//设置左侧子菜单
				if (menu[x].subMenu) {
					for (var y in menu[x].subMenu) {
						var titleSubmenu = menu[x].subMenu[y].title;
						if (titleSubmenu) {
							if ($('.location span:eq(3)').text() === titleSubmenu) {
								$('.leftMenu ul').append('<li><a class="on">' + titleSubmenu + '</a></li>');
							} else {
								$('.leftMenu ul').append('<li><a href="' + menu[x].subMenu[y].link + '">' + titleSubmenu + '</a></li>');
							}
						}
					}
				}
			}
		}
	}

	if (menu.length > 2) {
		var menuWidth = $('.menuCnm').width(),
		cnt = menu.length,
		itemWidth = Math.round((menuWidth - 150) / (cnt - 1)),
		lastWidth = menuWidth - itemWidth * (cnt - 2) - 150;
		$('.menuCnm ul li:not(.logo)').width(itemWidth);
		$('.menuCnm ul li:last-child').width(lastWidth);
	}
	
	var menuItemOn = $('.menuCnm li a.on').parent().index();
	naviEvent01(menu, menuItemOn);
	
	//点击盛欣公司logo跳转到根目录
	$(document).on('click', '.menuCnm ul li.logo', function() {
		location.href = '/';
	});
})

/**
 * 菜单动画效果生成函数
 * @param {Object} menu
 * @param {Object} menuItemOn
 */
function naviEvent01(menu, menuItemOn) {
	$('.menuCnm li a').mouseover(function() {
		$('.subMenuWrapper').offset({left: 0});
		$('.menuCnm li a').removeClass('on').children('img').remove();
		$(this).addClass('on');
		if (!$(this).children('img').length) {
//			$(this).prepend('<img src="/lib/img/menu/pic_menu.png" />');
		}
		var inx = $(this).parent().index(),
			subMenu = menu[inx].subMenu,
			ul = '<ul>';
		for (var i = 0; i < subMenu.length; i++) {
//			<img src="/lib/img/menu/pic_submenu.png" />
			ul += '<li><a href=' + subMenu[i].link + '><div class="submenuimg' + subMenu[i].link.split('.')[0].replace(/\//g, '-') + '"></div><p>' + subMenu[i].title + '</p></a></li>';
		}
		ul += '</ul>';
		if (!$('.subMenuWrapper').prev().hasClass('subMenuEmpty')) {
			$('.subMenuWrapper').before('<div class="subMenuEmpty"></div>');
		}
		$('.subMenu').empty().append(ul);
		$('.subMenuWrapper, .subMenuEmpty').show();
		$('.subMenuWrapper').width(90 * subMenu.length + 10);
		$('.subMenuEmpty').offset({
			left: $(this).offset().left
		});
		var posleft = $(this).offset().left - Math.round(($('.subMenuWrapper').width() - 100) / 2),
		minileft = ($('.menuWrapper').width() - $('.menuCnm').width())/2;
		posleft < minileft ? posleft  = minileft : '';
		(posleft - minileft + $('.subMenuWrapper').width()) > 1300 ? posleft = 1300 - $('.subMenuWrapper').width() + minileft : '';
		$('.subMenuWrapper').offset({
			left: posleft
		});
		
		//鼠标进入页面主体内容部分时二级菜单消失
		$('.contents, .detailContents, .defaultbox').mouseenter(function() {
			$('.subMenuWrapper, .subMenuEmpty').hide();
			$('.menuCnm li a').removeClass('on').children('img').remove();
			if (menuItemOn !== -1) {
				$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
			}
		});
		//鼠标离开二级菜单时二级菜单消失
		$('.subMenuWrapper').mouseleave(function() {
			$('.subMenuWrapper, .subMenuEmpty').hide();
			$('.menuCnm li a').removeClass('on').children('img').remove();
			if (menuItemOn !== -1) {
				$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
			}
		});
		//鼠标离开当前菜单项时二级菜单消失
		$('.menuCnm li a').mouseleave(function(e) {
			if (($(this).parent().is(':last-child') && e.pageX > $(this).offset().left + $(this).width()) || ($(this).parent().index() == 1 && e.pageX < $(this).offset().left) || e.pageY < $(this).offset().top) {
				$('.subMenuWrapper, .subMenuEmpty').hide();
				$('.menuCnm li a').removeClass('on').children('img').remove();
				if (menuItemOn !== -1) {
					$('.menuCnm li').eq(menuItemOn).children('a').addClass('on')/*.prepend('<img src="/lib/img/menu/pic_menu.png" />')*/;
				}
			}
		});

	});
}