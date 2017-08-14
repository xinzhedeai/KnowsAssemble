/**
 * 点击类为scrollToTop的按钮，然后整个页面回头最上面
 */
$('.scrollToTop').click(function() {
	$('html, body').animate({
		scrollTop: 0
	}, 200);
});

//在查询表单的输入框中点击回车，触发查询事件
$('form input').keypress(function(e) {
	var ev = document.all ? window.event : e; //浏览器兼容处理
	if(ev.keyCode === 13) {
		$(ev.target).parents('form').prev('.searchBtns').find('button:eq(0)').click();
		return false;
	}
});

/**
 * 1.所有表单不能输入特殊字符
 * 2.对输入框内容进行去空格操作
 */
$('form').on('keyup', 'input, textarea', function(e) {
	//禁止字符  ':222, ;:186, ^:54
	if(e.keyCode == 222 || e.keyCode == 186 || e.keyCode == 54) {
		$(this).val($(this).val().replace(/[';^]/g, ''));
	}
}).on('blur', 'input, textarea', function(e) {
	var newValue = $(this).val().trim();
	newValue = newValue.replace(/[\s]{2,}/, ' ');
	$(this).val(newValue);
});

/**
 * 拓展jquery方法
 * 设置弹窗居中
 * className为弹窗的外部容器
 */
jQuery.fn.setDialogCenter = function() {
	var heightWindow = $(window).height(),
		popup = $(this).find('.className'),
		marginTop = (heightWindow - popup.height()) / 2,
		heightBody = $(document.body).height();
	marginTop = marginTop > 10 ? marginTop : 10;
	marginTop = marginTop + $(document).scrollTop();
	popup.css('margin', 0);
	popup.css('top', marginTop);
	popup.css('left', ($(window).width() - popup.width()) / 2);
	var heightPopup = marginTop + popup.height() + 10,
		height = heightBody < heightWindow ? heightWindow : heightBody;
	$(this).css({
		height: height < heightPopup ? heightPopup : height
	});
}

/**
 *
 * @functionName: dragDialog
 * @Description: 对dialog进行拖拽
 * 有一点小bug，就是在弹窗拖拽到窗口外的时候，不能再操作了。
 * 应该对该方法进行优化，不让弹窗被拖拽到页面之外。
 */
jQuery.fn.dragDialog = function() {
		var _IsMove = 0,
			_MouseLeft = 0,
			_MouseTop = 0;
		return $(this).bind('mousemove', function(e) {
			if(_IsMove == 1) {
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
	 * 元素节点通过js动态添加到页面中后，如想出发时间，需要下面的on方法
	 */
$(document).on('click', '#goHomePage', function() {
	switch(str) {
		case 'a':
			location.href = 'a.html';
			break;
		default:
			break;
	}
});

/**
 *
 * @functionName: hideForm
 * @Description: 隐藏表单元素
 * 本方法主要用于在弹窗显示数据的时候，可以将增加、修改以及显示等功能整合到一个弹窗里面
 * 配合修改和取消按钮，达到先是查看数据，如果需要修改的话，则可以变为输入框。（增强了用户体验）
 */
jQuery.fn.hideForm = function() {
	window.datagrid = {}; //datagrid存储数据用
	if(!$(this).find('.textMark').length) {
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
			$(this).after('<span class="textMark" name="' + $(this).attr('name') + '">' + $(this).val() + '</span>');
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
 * 弹窗显示的时候，先将隐藏文本框组建，只显示内容
 *
 */
jQuery.fn.showForm = function() {
		$(this).find('.textMark').hide();
		$(this).find('.formMark').show();
		$(this).find('button.btnEdit, button.btnBack').hide();

		$(this).find('.idField').next('span.textbox.combo').hide(); //表单easyui组件隐藏 
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
 * 初始化表单
 *
 */
jQuery.fn.initForm = function() {
	$(this).find('.textMark').remove();
	$(this).find('.formMark').show();
	$(this).find('.formMark').removeClass('formMark');
	$(this).find('button.btnEdit').hide();

	$(this).find('span.textbox.combo').removeClass('noBorder'); //初始化表单的时候，显示combo组件
	$(this).find('a.textbox-icon.combo-arrow').removeClass('hideEle');
}

//使用:过滤元素(注意,在使用:的时候，前面又无空格是完全不同的)
var lastElement = $(tr).children('td:last-child:visible').children('*:first-child:visible');
//last元素是不是输入框
lastElement.is('input');
//窗口改变大小触发方法
$(window).resize(function() {
	toDo....
});


/**
 * @functionName: fillWindow
 * @Description: 当窗口没被填充满时，填充窗口
 * 当body的高度是随着内容的高度变化是，如果内容变小，那么需要给定一个最小的高度撑起body
 */
function fillWindow() {
	var height = $(window).height();
	if (height >= 570) {
		$('.main-body').css('min-height', height);
	}
}