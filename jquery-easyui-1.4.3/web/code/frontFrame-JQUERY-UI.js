'use strict';

/**
 * 
 * @functionName: datepickerJQueryUI
 * @Description: 自定义easyUI的create datepicker 方法
 * @param: options-选填
 */
jQuery.fn.datepickerJQueryUI = function() {
	var options = (arguments.length > 0 ? arguments[0] : {}),
	options_extend = {
		changeYear : true,
		changeMonth : true,
		showAnim : 'slideDown',
		showOn : 'both',
		buttonImageOnly: true,
		buttonImage : '/lib/img/ico/ico_calendar.png',
		buttonText : '选择日期',
		onClose : function(selectedDate) {
			 if ($(this).hasClass('startDate')) {
				if ($(this).next().next().hasClass('endDate')) {
					
					$(this).next().next().datepicker('option', 'minDate', selectedDate);
				}
			} else if ($(this).hasClass('endDate')) {
				if ($(this).prev().prev().hasClass('startDate')) {
					$(this).prev().prev().datepicker('option', 'maxDate', selectedDate);
				}
			}
		}
	};
	//如果定义为“年月视图”
	if (options.yearMonthView) {
		options.onChangeMonthYear = function() {
			var month = $('#ui-datepicker-div .ui-datepicker-month option:selected').val(),
			year = $('#ui-datepicker-div .ui-datepicker-year option:selected').val();
			if ($(this).hasClass('startDate')) {
				$(this).datepicker('setDate', new Date(year, month, 1));
			} else if ($(this).hasClass('endDate')) {
				var tempDate = new Date(year, parseInt(month) + 1, 1);
				tempDate.setDate(tempDate.getDate() - 1);
				$(this).datepicker('setDate', tempDate);
			} 
		};
		$('head').append('<style type="text/css">.ui-datepicker-calendar,.ui-datepicker-prev,.ui-datepicker-next{display: none;}</style>');
	}
	$.each(this, function(index, input) {
		if (!$(input).val()) {
			//设置开始日期为一个月前，结束日期为当天
			if ($(input).hasClass('startDate')) {
				var today = new Date();
				if (options.yearMonthView) { //"年月视图"
					/*初始值为一个月之前*/
					today.setDate(today.getDate() - 30);
					$(input).val(formatDate(today));
				} else {//"普通视图"
					today.setDate(today.getDate() - 6);
					$(input).val(formatDate(today));
				}
			} else if ($(input).hasClass('endDate')) {
				$(input).val(formatDate(new Date()));
			}
		}
	});
	options.yearMonthView = undefined;
	$.extend(options, options_extend);
	$(this).datepicker(options);
}

/**
 * @functionName: validateboxJqueryui
 * @Description: 自定义Jqueryui的验证date方法
 */
jQuery.fn.validateboxJqueryui = function(val) {
	var datePicker = this;
	if (val == '') {
		$(datePicker).css('box-shadow', '0px 0px 5px 1px #A7A7A7').addClass('validateboxJqueryui-invalid');
		$(datePicker).tooltip({
			position: 'right',
			content: '<span>该输入项为必输项</span>',
			onShow: function() {
				$(this).tooltip('tip').css({
					backgroundColor: 'rgb(255,255,204)',
					borderColor: 'rgb(204,153,51)'
				});
			}
		});
		$(datePicker).tooltip('show');
	} else {
		$(datePicker).css('box-shadow', '').removeClass('validateboxJqueryui-invalid');
		$(datePicker).tooltip('destroy');
	}
};

/**
 * @functionName: validateDatepicker
 * @Description: 自定义jqueryUI的验证表单方法
 */
jQuery.fn.validateDatepicker = function() {
	if ($(this).is('form')) {
		$(this).find('.startDate').blur();
//		$(this).find('.startDate.validateboxJqueryui-invalid:first').focus();  //日期弹出来 影响美观
		return $(this).find('.startDate.validateboxJqueryui-invalid').length == 0;
	}
};

$(function() {
	//date验证
	$('.startDate').each(function(i, datePicker) {
		var options = $(datePicker).attr('data-options');
		if (options) {
			options = options.split(',');
			$.each(options, function(i, option) {
				option = option.split(':');
				if (option[0] == 'required' && option[1] == 'true') {
					$(datePicker).on('click', function() {
						$(datePicker).validateboxJqueryui($(this).val().trim());
						$(this).focus();
					}).on('blur', function() {
						$(datePicker).validateboxJqueryui($(this).val().trim());
					}).on('change', function() {
						$(datePicker).validateboxJqueryui($(this).val().trim());
					}).on('keypress', function() {
						$(datePicker).validateboxJqueryui($(this).val().trim());
					});
				}
			});
		}
	});
});