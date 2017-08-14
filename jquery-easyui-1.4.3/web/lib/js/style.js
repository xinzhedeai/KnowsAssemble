'use strict';
//判断是否有cookie，没有则返回登录页面
var userInfo = getCookie('userInfo'), warehouse_type = undefined;
if(!userInfo){
	location.href = "../login.html";
}else{
	userInfo = $.parseJSON(userInfo);
}
$(function(){
	var headerEle = '<div class="header-title">' +
						'<i class="fa fa-globe" style="margin: -12px 6px auto 8px;"></i><span>warehouse system</span>'+
					'</div>'+
					'<div class="header-userInfo">'+
						 '<a id="goHomePage">首页</a>'+
						 '<a href="../../basic/userDetail.html">'+ userInfo.user_id +'</a>'+
			    		 '<a id="logout">登出系统</a>'+
					'</div>';
	
	$('.pagesHeader').on('click', '#goHomePage', function(){
		switch(userInfo.warehouse_type){
			case 'root' :
				location.href = '../../company/companyDetail.html';
				break;
			case 'warehouse' : 
				location.href = '../../warehouse/warehouseDetail.html';
				break;
			case 'node' :
				location.href = '../../network/networkDetail.html';
				break;
			case 'company' :
				location.href = '../../company/companyDetail.html';
				break;	
			default :
				break;
		}
	});
	$('.pagesHeader').html(headerEle);
});

//当前页面
localStorage.lastRequestPage = window.location.href;


var getNavLanguage = function(){
    if(navigator.appName == "Netscape"){
        var navLanguage = navigator.language;
        return navLanguage.substr(0,2);
    }
    return false;
}

//datagrid存储数据
//window.datagrid = {};
/**
 *
 * @functionName: hideForm
 * @Description: 隐藏表单元素
 * @author: Double
 *
 */
jQuery.fn.hideForm = function() {
	if (!$(this).find('.textMark').length) {	//0	
		$(this).find('input:visible, select:visible, textarea:visible, button:visible, img.ui-datepicker-trigger, ul.picList li a:eq(0), .icon:visible').addClass('formMark');
		$(this).find('.datagrid').find('input:visible, select:visible, textarea:visible, button:visible').removeClass('formMark');
		$(this).find('.pagination').find('input:visible, select:visible, textarea:visible, button:visible').removeClass('formMark');
		$(this).find('.fileupload').find('input:visible, select:visible, textarea:visible, button:visible').removeClass('formMark');
		$(this).find('.suggest').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('.combox').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('.textbox.spinner').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('.textbox.combo').addClass('formMark').find('input:visible').removeClass('formMark');
		$(this).find('button.btnEdit, button.btnBack').removeClass('formMark');
		$(this).find('input[type="text"].formMark').each(function() {
			$(this).after('<span class="textMark" name="'+ $(this).attr('name') +'">' + $(this).val() + '</span>');
		});
		$(this).find('select.formMark').each(function() {
			$(this).after('<span class="textMark"  value="' + $(this).val() + '">' + $(this).find('option:selected').text() + '</span>');
		});
		$(this).find('textarea.formMark').each(function() {
			$(this).after('<span class="textMark">' + $(this).val() + '</span>');
		});
		$(this).find('.suggest.formMark').each(function() {
			$(this).after('<span class="textMark">' + $(this).find('input').val() + '</span>');
		});
		$(this).find('.combox.formMark').each(function() {
			$(this).after('<span class="textMark">' + $(this).children('input').val() + '</span>');
		});
		$(this).find('.textbox.spinner.formMark').each(function() {
			$(this).after('<span class="textMark">' + $(this).children('input.textbox-value').val() + '</span>');
		});	
		$(this).find('.textbox.combo.formMark').each(function() {
			$(this).after('<span class="textMark">' + $(this).children('input.textbox-value').val() + '</span>');
		//	$(this).after('<span class="textMark">' + $(this).children('input.combobox-f.combo-f.textbox-f').combobox('getText') + '</span>');
		});	
	} else { //1
		$(this).find('input.formMark').each(function() {
			$(this).val($(this).next().text());
		});
		$(this).find('select.formMark').each(function() {
			$(this).val($(this).next().attr('value'));
		});
		$(this).find('textarea.formMark').each(function() {
			$(this).val($(this).next().text());
		});
		$(this).find('.suggest.formMark').each(function() {
			$(this).find('input').val($(this).next().text());
		});
		$(this).find('.combox.formMark').each(function() {
			$(this).find('ul li button').click();
			combox[$(this).attr('comboxindex')].setSelection($(this).next().text());
		});
		$(this).find('.textbox.spinner.formMark').each(function() {
			$(this).prev().timespinner('setValue', $(this).next().text());
		});
	/*	$(this).find('.textbox.spinner.formMark').each(function() {
			$(this).prev().timespinner('setValue', $(this).next().text());
		});*/
		$(this).find('.textMark').show();
		//datagrid 恢复数据
/*		$(this).find('.datagrid').each(function(i, datagrid) {
			var id = $(datagrid).find('.datagrid-view').children('table').attr('id');
			$('#' + id).datagrid('loadData', window.datagrid[id]);
			$(datagrid).hideForm();
		});*/
		$(this).find('.spanHide').hide();
	}
	$(this).find('.formMark').hide().end().find('button.btnEdit, button.btnBack').show();
	$(this).find('span.textbox.combo').addClass("noBorder");
	$(this).find('a.textbox-icon.combo-arrow').addClass("hideEle");
}

/**
 *
 * @functionName: showForm
 * @Description: 显示表单元素
 * @author: Double
 *
 */
jQuery.fn.showForm = function() {
	$(this).find('.textMark').hide();
	$(this).find('.formMark').show();
	$(this).find('button.btnEdit, button.btnBack').hide();
	
	$(this).find('.idField').next('span.textbox.combo').hide();//表单easyui组件隐藏 
	$(this).find('.idField').nextAll('.textMark').show();
	$(this).find('.idField').hide();
	
	$(this).find('span.textbox.combo').removeClass('noBorder');
	$(this).find('a.textbox-icon.combo-arrow').removeClass('hideEle');
	
	//datagrid 存储数据
/*	$(this).find('.datagrid').each(function(i, datagrid) {
		var id = $(datagrid).find('.datagrid-view').children('table').attr('id');
		window.datagrid[id] = $('#' + id).datagrid('getData');
	});*/
}
/**
 *
 * @functionName: initForm
 * @Description: 显示表单元素
 * @author: Double
 *
 */
jQuery.fn.initForm = function() {
	$(this).find('.textMark').remove();
	$(this).find('.formMark').show();
	$(this).find('.formMark').removeClass('formMark');
	$(this).find('button.btnEdit').hide();
	
	$(this).find('span.textbox.combo').removeClass('noBorder');//初始化表单的时候，显示combo组件
	$(this).find('a.textbox-icon.combo-arrow').removeClass('hideEle');
/*	$.each($(this).find('form'), function(index, form) {
		form.reset();
		$(form).find('.combox .bui-tag-follow ul li button').click();
	});
	$(this).find('ul.picList').empty();*/
}

/*jQuery.fn.modalOnMove = function(left, top) {
	var l = left;
	var t = top;
	if (l < 1) {
		l = 1;
	}
	if (t < 1) {
		t = 1;
	}
	var width = parseInt($(this).parent().css('width')) + 14;
	var height = parseInt($(this).parent().css('height')) + 14;
	var right = l + width;
	var buttom = t + height;
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	if (right > browserWidth) {
		l = browserWidth - width;
	}
	if (buttom > browserHeight) {
		t = browserHeight - height;
	}
	$(this).parent().css({ 修正面板位置 
		left : l,
		top : t
	});
};*/

/**
 *
 * @functionName: dragDialog
 * @Description: 对dialog进行拖拽
 * @author: Double
 *
 */
jQuery.fn.dragDialog = function() {
	var _IsMove = 0,
		_MouseLeft = 0,
		_MouseTop = 0;
	return $(this).bind('mousemove', function(e) {
		if (_IsMove == 1) {
			$(this).parent().offset({
				top: e.pageY - _MouseTop,
				left: e.pageX - _MouseLeft
			});
		}
	}).bind('mousedown', function(e) {
		_IsMove = 1;
		var offset = $(this).offset();
		_MouseLeft = e.pageX - offset.left;
		_MouseTop = e.pageY - offset.top;
	}).bind('mouseup', function() {
		_IsMove = 0;
	}).bind('mouseout', function() {
		_IsMove = 0;
	}); 
}

/**
 *
 * @functionName: setDialogCenter
 * @Description: 使dialog居中
 * @author: Double
 *
 */
jQuery.fn.setDialogCenter = function() {
	var heightWindow = $(window).height(),
		popup = $(this).find('.aplPopupWrapper'),
		marginTop = (heightWindow - popup.height()) / 2,
		heightBody = $(document.body).height();
	marginTop = marginTop > 10 ? marginTop : 10;
	marginTop = marginTop + $(document).scrollTop();
	popup.css('margin', 0);
	popup.css('top', marginTop);
	popup.css('left', ($(window).width() - popup.width()) / 2);
//	popup.css('margin-top', marginTop);
	//	popup.css('margin-left', 0);
	var heightPopup = marginTop + popup.height() + 10,
		height = heightBody < heightWindow ? heightWindow : heightBody;
	$(this).css({
		height: height < heightPopup ? heightPopup : height
	});
}

/**
 *
 * @functionName: showDialog
 * @Description: 弹出dialog
 * @author: Double
 *
 */
jQuery.fn.showDialog = function() {
	//dialog中的plupload plugin
	if ($(this).find('.fileupload').length) {
		$(this).find('.fileupload').fileUpload();
	}
	$(this).show();
	

	//隐藏验证红框
	$(this).find('form').hideAllValidation();
	if (!$(this).hasClass('noHideForm')) {
		$(this).hideForm(); //dialog show之后隐藏表单元素
	} else {
		$(this).find('button.btnEdit').hide();
	}
	//设置弹窗中的表单元素Fit
	$(this).find('form').setFormFit();
	//设置弹窗位置居中
	$(this).setDialogCenter();
}

/**
 *
 * @functionName: createVerticalTable
 * @Description: 在dialog中创建用于显示数据的垂直表格
 * @author: Double
 * @param: options
 */
jQuery.fn.createVerticalTable = function(options) {
	var data = options.data;
	if (data.errCd === 0) {
		var columns = options.columns,
			result = data.result,
			rows = result.rows,
			colgroup = '',
			thead = '',
			visibleRows = '',
			leftoverRows = '',
			visibleRowsCount = 10;
		for (var i = 0; i < columns.length; i++) {
			colgroup += '<col width="' + columns[i].width + '"/>';
			thead += '<th>' + columns[i].title + '</th>';
		}

		for (var i = 0; i < rows.length && i < visibleRowsCount; i++) {
			visibleRows += '<tr>';
			for (var j = 0; j < columns.length; j++) {
				visibleRows += '<td>' + rows[i][columns[j].field] + '</td>'
			}
			visibleRows += '</tr>';
		}

		for (var i = visibleRowsCount; i < rows.length; i++) {
			leftoverRows += '<tr>';
			for (var j = 0; j < columns.length; j++) {
				leftoverRows += '<td>' + rows[i][columns[j].field] + '</td>'
			}
			leftoverRows += '</tr>';
		}
		if ($(this).prev().hasClass('popupVerticalTableTh')) {
			$(this).prev().remove();
		}
		//		$(this).before('<table class="popupVerticalTable" summary="垂直表格标题"><colgroup>' + colgroup + '</colgroup><thead><tr>' + thead + '</tr></thead></table>');
		$(this).addClass('popupVerticalTable');
		$(this).html('<colgroup>' + colgroup + '</colgroup><thead><tr>' + thead + '</tr></thead><tbody>' + visibleRows + '</tbody>');
		if (rows.length > visibleRowsCount) {
			/*var scrollWidth = getScrollWidth(), relativeScrollWidth = scrollWidth * columns[0].width / $(this).prev('table.popupVerticalTableTh').find('thead th:eq(0)').width();
			$(this).css({'margin': '0', 'width': '100%'});
			$(this).wrap('<div style="margin: 0 auto; width: 95%; overflow-y: scroll; height: ' + $(this).height() + 'px;"></div>');
			var theadTable = $(this).parent().prev('table.popupVerticalTableTh');
			theadTable.css({'margin': '0', 'width': $(this).width()});
			theadTable.wrap('<div style="margin: 0 auto; width: 95%; background-color: #fafafa; border-style: solid; border-color: #cacaca; border-width: 0px;"></div>');
//			theadTable.css({'margin': '0', 'width': $(this).width()}).wrap('<div style="margin: 0 auto; width: 95%; background-color: #fafafa; border-style: solid; border-color: #cacaca; border-width: 1px 1px 1px 0px;"></div>');
//			theadTable.find('tr th').css('border-width', '0 0 0 1px');
*/
			$(this).css({
				'margin': '0',
				'width': '100%'
			});
			$(this).wrap('<div class="popupVerticalTableScroll"></div>');
			$(this).find('tbody').append(leftoverRows);
			$(this).find('thead tr:first-child th').css('border-top-width', '0');
			$(this).find('tbody tr:last-child td').css('border-bottom-width', '0');
		}
	}
}

/**
 *
 * @functionName: setFormFit
 * @Description: 设置表单元素Fit
 * @author: Double
 *
 */
jQuery.fn.setFormFit = function() {
	$.each($(this).find('input.inputFit:visible, textarea.textareaFit:visible'), function(i, element) {
		var width = 0;
		$.each($(element).parents('table').find('tbody tr:visible'), function(i, tr) {
			var lastElement = $(tr).children('td:last-child:visible').children('*:first-child:visible');
			if ((lastElement.is('input') || lastElement.is('select') || lastElement.is('textarea')) && !lastElement.hasClass('inputFit') && !lastElement.hasClass('textareaFit')) {
				var widthTemp = $(tr).outerWidth() - $(tr).children('td:last-child').outerWidth() - $(tr).children('th:first-child').outerWidth() + lastElement.outerWidth();
				width < widthTemp ? width = widthTemp : '';
			}
		});
		$(element).outerWidth(width);
	});
}


/**
*
* @functionName: callMask
* @Description: 呼叫遮罩层
* @author: Double
*
*/
function callMask() {
	$('body').append('<div class="popupWrapper" style="display: block;"><div class="mask-info"><div class="mask-img"></div><p>努力处理中...</p></div></div>');
}

/**
*
* @functionName: removeMask
* @Description: 踢走遮罩层
* @author: Double
*
*/
function removeMask() {
	$('body').css('overflow', 'auto').find('.popupWrapper').remove();
}

/**
 *
 * @functionName: fillWindow
 * @Description: 当窗口没被填充满时，填充窗口
 * @author: Double
 *
 */
function fillWindow() {
	var height = $(window).height() - 145-9;
	if (height >= 570) {
		$('.main-body').css('min-height', height);
	}
}

//权限验证
$(function() {
	
	//页面加载完成后，重置所有表单
	$.each($('form'), function(index, form) {
		form.reset();
		//设置普通页面的表单元素Fit
		$(form).setFormFit();
	});

	//为查询条件表单searchForm定义验证
	$('.searchForm input').attr('maxlength', 30);
	//所有表单不能输入特殊字符
	$('form').on('keyup', 'input, textarea', function(e) {
		//禁止字符  ':222, ;:186, ^:54
		if (e.keyCode == 222 || e.keyCode == 186 || e.keyCode == 54) {
			$(this).val($(this).val().replace(/[';^]/g, ''));
		}
	}).on('blur', 'input, textarea', function(e) {
		var newValue = $(this).val().trim();
		newValue = newValue.replace(/[\s]{2,}/, ' ');
		$(this).val(newValue);
	});


	//填充窗口
	fillWindow();

	//logo link
	$('.defaultbox .logo a').attr('href', '/index.html').attr('title', '点击进入网站首页');

	//窗口调整大小后重新fill
	$(window).resize(function() {
		fillWindow();
	});
	
	//scroll to top
	$('body').append('<a title="回到顶部" class="scrollToTop"></a>');
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
		//datagrid滚动显示
		var datagrid = $('.acticle .datagrid:eq(0)'), searchBtns = datagrid.prevAll('.searchBtns:eq(0)'), 
		scrollSwitch = datagrid.find('.datagrid-view').next().find('.scrollSwitch');
		if(scrollSwitch.length && (scrollSwitch.switchbutton('options').checked)) { 
			if ($(this).scrollTop() >= searchBtns.offset().top) {
				var otherHeight = $('.footerWrapper').height() + parseInt($('.acticle').css('padding-bottom')) + searchBtns.height() +130;
		/*		if (searchBtns.next().hasClass('button-hover-title')) {
					otherHeight += searchBtns.next().height() - 12;
				}*/
				$('#' + datagrid.find('.datagrid-view').children('table').attr('id')).datagrid('resize', {height: $(this).height() - otherHeight});
			} else {
				$('#' + datagrid.find('.datagrid-view').children('table').attr('id')).datagrid('resize', {height: 'auto'});
			}
		}
	});
	$('.scrollToTop').click(function() {
		$('html, body').animate({
			scrollTop: 0
		}, 200);
	});


	//在查询表单的输入框中点击回车，触发查询事件
	$('.searchForm input').keypress(function(e) {
		if (e.keyCode === 13) {
			$(e.target).parents('form').prev('.searchBtns').find('button:eq(0)').click();
			return false;
		}
	});

	//dialog拖拽效果
	$('.aplPopupTitle').dragDialog();

	//关闭dialog
	$('.aplPopupXbtn').click(function() {
		$(this).parents('.popupWrapper').closeDialog();
	});

	var fg="";
	//关闭alert confirm弹窗
//	$(document).on('click', '.aplConfirmCancel, .aplConfirmXbtn, .aplConfirmOk', function() {
//		$(this).parents('.confirmWrapper').remove();
//	});
	
});
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

