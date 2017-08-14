'use strict';

/**
 * 
 * @functionName: datagridViewEasyUI
 * @Description:扩展easyUI的datagridView
 * @author: Double
 * @param:
 */
// $.fn.datagrid.defaults.view
var datagridViewEasyUI = $.extend({}, $.fn.datagrid.defaults.view, {
	onAfterRender : function(target) {
		$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
		var vc = $(target).datagrid('getPanel').children('div.datagrid-view').children('.datagrid-view2');
		vc.parent('div.datagrid-view').css('background', 'none');
		vc.children('div.datagrid-empty').remove();
		if (!$(target).datagrid('getRows').length) {
			vc.parent('div.datagrid-view').css('background-color', '#efefef');
			$('<div class="datagrid-empty"></div>').html('<img src="/lib/img/pic/pic_empty.png"/><p style="font-size:14px;">未查询到数据</p>').appendTo(vc);
		}
		if ($(target).parents('.popupWrapper').length) {
			vc.parents('.datagrid-wrap').find('.datagrid-pager table').css('margin-left', (vc.parents('.datagrid-wrap').find('.datagrid-pager').width() - vc.parents('.datagrid-wrap').find('.datagrid-pager table').width()) / 2);
		}
		//填充窗口
		fillWindow();
		//datagrid滚动显示
		var datagrid = $('.acticle .datagrid:eq(0)'), searchBtns = datagrid.prevAll('.searchBtns:eq(0)'), 
		scrollSwitch = datagrid.find('.datagrid-view').next().find('.scrollSwitch');
		if(scrollSwitch.length && (scrollSwitch.switchbutton('options').checked)) { 
			$(window).scrollTop(0);
			$(window).scrollTop(searchBtns.offset().top + 1);
		}
	}
});

/**
 * 
 * @functionName: datagridEasyUI
 * @Description: 自定义easyUI的create datagrid 方法
 * @author: Double
 * @param: options
 */
jQuery.fn.datagridEasyUI = function() {
	if (arguments.length === 1) {
		var options = arguments[0], datagridElement = this,
		options_extend = { 
			view : datagridViewEasyUI,
			checkOnSelect : false,
			selectOnCheck : false,
			singleSelect : true,
			scrollbarSize : 0,
//			nowrap : false,
			autoRowHeight: false,
			loadFilter : function(data) {
				if (data && data.errCd === 0 && data.result) {
					data = data.result;
				} else if (data && data.rows) {
					data = data;
				} else {
					if (data.errCd === -600) {
						var option = {								
								btn: parseInt("0001",2),
								onOk: function(){
									delCookie('access-token');
						    		window.location.href = '/login.html';
								},	
								onClose: function(){
									delCookie('access-token');
						    		window.location.href = '/login.html';
								}
							}							
						$xcAlert("请登录", $xcAlert.typeEnum.warning,option);
				    } else {
				    	$xcAlert("Error:"+ data.errMsg + "(" + data.errCd + ")", $xcAlert.typeEnum.error);				     	
				    }
					data = {
						'total' : 0,
						'summarys' : null,
						'rows' : []
					};
				}
				if (data.summarys) {
					var summaryLi = $(this).parents('.datagrid').prevAll('.membership:eq(0)').find('ul li');
					for (var x in data.summarys) {
						summaryLi.eq(x).children('span').text(data.summarys[x]);
					}
				} else {
					$(this).parents('.datagrid').prevAll('.membership:eq(0)').find('ul li span').text(0);
				}
				return data;
			},
			onLoadSuccess : function(data) {
				//如果跨页选择：off
				if($(this).parents('.datagrid-view').next().find('.crossPageSwitch').length && !($(this).parents('.datagrid-view').next().find('.crossPageSwitch').switchbutton('options').checked)) { 
	            	$(this).datagrid('clearChecked'); //uncheck所有行
				}
				//如果条件操作：on
				if($(this).parents('.datagrid-view').next().find('.conditionSwitch').length && ($(this).parents('.datagrid-view').next().find('.conditionSwitch').switchbutton('options').checked)) {
					if ($(this).datagrid('options').frozenColumns.length) {  //有冻结列的情况
						$(this).prev().prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', true) //disable checkbox 列
					} else {
						$(this).prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', true) //disable checkbox 列
					}
				}
				//如果是datagrid在dialog中，则隐藏datagrid中的表单元素，并使dialog居中
				if ($(this).parents('.popupWrapper').length) {
					$(this).parents('.popupWrapper:eq(0)').setDialogCenter();
					if ($(this).parents('.popupWrapper:eq(0)').find('.formMark:hidden').length) {
						$(this).parents('.datagrid').hideForm();
					}
				}
				//如果一个页面中左右各有一个datagrid,则右边的datagrid的高度向左边看齐
				if ($(this).parents('.leftPart').length && $(this).parents('.leftPart').nextAll('.rightPart:eq(0)').find('.datagrid').length) {
					var dgRight = '#' + $(this).parents('.leftPart').nextAll('.rightPart:eq(0)').find('.datagrid .datagrid-view').children('table').attr('id'),
					height = $(this).parents('.datagrid-view').height() - 76;
					height = height > 400 ? height : 400;
					$(dgRight).datagrid('resize', {height: height});
				}
				if (!$(this).datagrid('options').fitColumns) {
					if(data.total) {
						$(this).datagrid('getPanel').find('div.datagrid-view .datagrid-view2 .datagrid-body').css({height: 'auto', overflow: 'auto'});				
					} else {
						$(this).datagrid('getPanel').find('div.datagrid-view').css({height: '141px'}).find('.datagrid-view2 .datagrid-body').css({height: '12px', overflow: 'hidden'});
					}
				}
				
				//针对waybills页面的无数据表格
				if ($('#datagridWaybill').length && data.total == 0 && !$('#datagridWaybill').datagrid('options').fitColumns) {
					$('#datagridWaybill').parents('.datagrid').find('.datagrid-view2 .datagrid-htable').width(913);
				}
				
			},
			onLoadError : function(e) {
			    $(this).datagrid('loadData', {}); 
//			    $alert('Error: ' + e.statusText + '(' + e.status + ')');
				$xcAlert('Error: ' + e.statusText + '(' + e.status + ')', $xcAlert.typeEnum.error);			
			 },
			onBeforeLoad : function(param) { //liuliang
				var pageName = getPageName();
				pageName = pageName.replace('-','');
				if ($(this).parents('.popupWrapper').length){ 	//判断是否为dialog中的datagrid
					
				} else if ($(this).parents('.leftPart').length) {	//判断是否为页面左侧的datagrid
					//setCookie(pageName,JSON.stringify(param),"1");
					if (getCookie("map")) {
						var getMap = $.parseJSON(getCookie("map"));
						getMap[pageName] = JSON.stringify(param);
						setCookie("map",JSON.stringify(getMap),"1");
					} else {
						var newMap = {};
						newMap[pageName] = JSON.stringify(param);
						setCookie("map",JSON.stringify(newMap),"1");
					}
				} else if ($(this).parents('.rightPart').length){	//判断是否为页面右侧的datagrid
					
				} else {	//主页面中只有一个datagrid
					//setCookie(pageName,JSON.stringify(param),"1");
					if (getCookie("map")) {
						var getMap = $.parseJSON(getCookie("map"));		//获取Cookie中的数据,json格式
						getMap[pageName] = JSON.stringify(param);	//对json中相应键值对赋值
						setCookie("map",JSON.stringify(getMap),"1");	//将最新的json数据存入Cookie
					} else {
						var newMap = {};	//创建新的json
						newMap[pageName] = JSON.stringify(param);	//创建键值对
						setCookie("map",JSON.stringify(newMap),"1");	//存入cookie
					}
				}
			}
		};
		//跨页选择、条件操作、滚动显示
		if (options.crossPageSwitch || options.conditionSwitch || options.scrollSwitch) {
			$(this).after('<div class="pagerButtons"></div>');
			//跨页选择开关
			if (options.crossPageSwitch) {
				$(this).next().append('<span style="margin-right: 8px;">跨页选择:<input class="crossPageSwitch" style="width: 40px; height: 18px;" checked /></span>');
				$(this).next().find('.crossPageSwitch').switchbutton({
					width : 30,
					onText : '',
					offText : '',
				    checked : localStorage.crossPageSwitch === 'off' ? false : true,
				    onChange : function(checked) {
				    	localStorage.crossPageSwitch = checked ? 'on' : 'off';
				        if (!checked) {
				        	var allCheckedRows = $(datagridElement).datagrid('getChecked').slice(0), recentPageRows = $(datagridElement).datagrid('getRows');
				        	$(datagridElement).datagrid('clearChecked'); //uncheck所有行
				        	if (allCheckedRows && recentPageRows) {//check当前页
				        		for (var i = 0; i < allCheckedRows.length; i++) {
				        			var index = $(datagridElement).datagrid('getRowIndex', allCheckedRows[i]);
				        			if (index > -1) {
				        				$(datagridElement).datagrid('checkRow', index);
				        			}
				        		}
							}
				        }
				    }
				});
				options.crossPageSwitch = undefined;
			}
			//条件操作开关
			if (options.conditionSwitch) {
				$(this).next().append('<span style="margin-right: 8px;">条件操作:<input class="conditionSwitch" style="width: 40px; height: 18px;" /></span>');
				$(this).next().find('.conditionSwitch').switchbutton({
					width : 30,
					onText : '',
					offText : '',
				    checked : localStorage.conditionSwitch === 'on' ? true : false,
				    onChange : function(checked) {
				    	localStorage.conditionSwitch = checked ? 'on' : 'off';
				        if (checked) { //打开条件操作
				        	$(datagridElement).datagrid('clearChecked'); //uncheck所有行
				        	if ($(datagridElement).datagrid('options').frozenColumns.length) {  //有冻结列的情况
								$(datagridElement).prev().prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', true) //disable checkbox 列
							} else {
								$(datagridElement).prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', true) //disable checkbox 列
							}
				        } else { //关闭条件操作
				        	if ($(datagridElement).datagrid('options').frozenColumns.length) {  //有冻结列的情况
								$(datagridElement).prev().prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', false) //disable checkbox 列
							} else {
								$(datagridElement).prev().find('.datagrid-header, .datagrid-body').find('table tbody tr td[field="ck"] input[type="checkbox"]').attr('disabled', false) //disable checkbox 列
							}
				        }
				    }
				});
				options.conditionSwitch = undefined;
			}
			//滚动显示开关
			if (options.scrollSwitch) {
				$(this).next().append('<span style="margin-right: 8px;">滚动显示:<input class="scrollSwitch" style="width: 40px; height: 18px;" /></span>');
				$(this).next().find('.scrollSwitch').switchbutton({
					width : 30,
					onText : '',
					offText : '',
				    checked : localStorage.scrollSwitch === 'off' ? false : true,
				    onChange : function(checked) {
				    	localStorage.scrollSwitch = checked ? 'on' : 'off';
				        if (checked) { //打开滚动显示
				        	if ($(window).scrollTop() >= $(datagridElement).parents('.datagrid').offset().top) {
				        		$(window).scrollTop($(datagridElement).parents('.datagrid').offset().top);
				        	}
				        } else { //关闭滚动显示
							$(datagridElement).datagrid('resize', {height: 'auto'});
				        }
				    }
				});
				options.scrollSwitch = undefined;
			}
			//下载本页数据
			if (options.downloadPage) {
				$(this).next().append('<span style="margin-right: 8px;"><a class="btnPrimary btnSmall downloadPage">下载本页</a></span>');
				$(this).next().find('.downloadPage').click(function() {
					
					//整理下载数据
					var fields = [], content = '\uFEFF', separator = ',', 
					isIE = getNavigator().indexOf('IE') > -1 ? true : false;
					//关于单元格分隔符：IE用'\t'，其他浏览器用','
					isIE ? separator = '\t' : '';
					var columns = [], frozenColumns = $(datagridElement).datagrid('options').frozenColumns;
					frozenColumns && frozenColumns[0] ? columns = columns.concat(frozenColumns[0]) : '';
					columns = columns.concat($(datagridElement).datagrid('options').columns[0]);
					$.each(columns, function(i, column) {
						if (!column.hidden && column.title) {
							content += column.title + separator;
							fields.push(column.field);
						}
					});
					//标题换行
					content += '\n';
					$.each($(datagridElement).datagrid('getRows'), function(i, row) {
						$.each(fields, function(i, field) {
							var cell = row[field];
							//将单元格内容转为String类型
							!cell ? cell = '' : cell += '';
							//英文逗号会切换到下一个单元格,替换，防止切换
							cell = cell.replace(/,/g, '，');
							//避免Excel将数字串显示为科学计数法
							cell && cell.length >= 9 && !isNaN(cell) ? cell = '=TRIM(' + cell + ')' : '';
							//去掉datetime字符串最后的".0",使日期在Excel中正常显示
							/^(\d{4})\-(\d{1,2})\-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/.test(cell) ? cell = cell.slice(0, 18) : '';
							//单元格赋值
							content += cell + separator;
						});
						//内容换行
						content += '\n';
					});
					//HTML标题
				    var filename = $('.acticleTitle');
				    if (filename.length) {
				    	filename = filename[0].innerHTML;
				    } else {//如果未找到HTML标题，文件名为第一列列名
				    	filename = fields[0];
				    }
				    if ($(datagridElement).datagrid('getPager').length) {
				    	filename += '-' + $(datagridElement).datagrid('getPager')[0].children[0].innerHTML.split(',')[0];
				    }
				    filename += '.xls';
				    
				    //进行下载 ，此方法为通用方法，位于common.js
				    downloadByJS({filename: filename, content: content, target: this});
				});
				options.downloadPage = undefined;
			}
		}
		//是否展示细节
		if (options.detailView) {
			$.extend(options_extend.view, detailview);
			options.detailView = undefined;
		}
		$.extend(options, options_extend);
		if ($(this).parents('.popupWrapper').length) {
			$(this).parents('.popupWrapper:eq(0)').show();
		}
		//创建datagrid
		$(this).datagrid(options); 
		if ($(this).parents('.popupWrapper').length) {
			$(this).parents('.popupWrapper:eq(0)').hide();
		}
		if (options.pagination) {
			var pager = $(this).datagrid('getPager'); // get the pager of datagrid
			var buttons = '', pagination = {};
			if ($(this).parents('.datagrid').next().hasClass('pagerButtons')) {
				buttons = $(this).parents('.datagrid').next();
				pagination.buttons = buttons;
				if (buttons.find('.scrollSwitch').length) {
					pagination.onChangePageSize = function(pageSize) {
						$(datagridElement).datagrid('resize', {height: 'auto'});
					}
				}
			}
			if ($(this).parents('.popupWrapper').length) {
				pagination.layout = ['first', 'prev', 'next', 'last'];
			}
			pager.pagination(pagination);
		}
	} else {	
		$xcAlert("datagridEasyUI : 参数错误, 支持1个参数(options)", $xcAlert.typeEnum.error);
	}
} 

/**
 * @functionName: downloadFileEasyUI
 * @Description: 自定义下载方法,datagrid下载或表单下载
 * @author: Double
 * @param: option {
 * 			url: 必填
 * 			field: 必填,datagrid主键列或表单主键域
 * 			button: 触发下载事件的按钮
 * 			param: 选填, 附加参数,值 {pram1: val1, pram2: val2, ...}
 * 			callback: 选填, 是否有回调函数, 值为true或false
 * 			success: 选填, 回调函数, 值 function
 * 		}
 */
jQuery.fn.downloadFileEasyUI = function() {
	if (arguments.length === 1) {
		var option = arguments[0], url = option.url, field = option.field, button = option.button, queryParam = option.param;
		queryParam = queryParam ? queryParam : {};
		if (this[0].tagName === 'TABLE') { //datagrid下载
			queryParam.operate_type = '01';
			if($(this).parents('.datagrid-view').next().find('.conditionSwitch').length && ($(this).parents('.datagrid-view').next().find('.conditionSwitch').switchbutton('options').checked)) { 
				//如果条件操作：on
				queryParam.operate_type = '02';
				queryParam.params = JSON.stringify(serializeObject($(this).parents('.datagrid').prevAll('.searchForm:eq(0)')));
				/*$confirm('确认要按查询条件下载吗？', function() {
					downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
				});*/
				var option = {								
						btn: parseInt("0011",2),
						onOk: function(){
							downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
						},	
					}							
				$xcAlert("确认要按查询条件下载吗？", $xcAlert.typeEnum.info,option);

			} else {
				var rows = $(this).datagrid('getChecked');
				if (rows.length) {
					var ids = [];
					for (var i=0; i<rows.length; i++) {
						if (field.length > 1) {
							var obj = new Object();
							for (var j=0; j<field.length; j++) {
								obj[field[j]] = rows[i][field[j]];
							}
							ids.push(obj);
						} else {
							ids.push(rows[i][field[0]]);
						}
					}
					queryParam.params = JSON.stringify(ids);
					/*$confirm('共选择了' + rows.length + '条数据，确认要下载吗？', function() {
						downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
					});*/
					var option = {								
							btn: parseInt("0011",2),
							onOk: function(){
								downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
							},	
						}							
					$xcAlert("共选择了" + rows.length + "条数据，确认要下载吗？", $xcAlert.typeEnum.info,option);
				} else {
					$xcAlert("请选择要下载的数据。", $xcAlert.typeEnum.warning);				
				}
			}
		} else if (this[0].tagName === 'FORM') { //表单下载
			var formObj = serializeObject($(this));
			$.each(field, function(i, field) {
				queryParam[field] = formObj[field];
			});
			var option = {								
					btn: parseInt("0011",2),
					onOk: function(){
						downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
					},	
				}							
			$xcAlert("确认要下载吗？", $xcAlert.typeEnum.info,option);		
			/*$confirm('确认要下载吗？', function() {
				downloadByForm({url : url, param : queryParam, button : button, callback : option.callback, success : option.success});
			});*/
		}
	} else {
		$xcAlert("downloadFileEasyUI : 参数错误, 支持1个参数(option{url, field, button, param-选填, callback-选填, success-选填})", $xcAlert.typeEnum.error);	
	}
} 

/**
 * 
 * @functionName: getIdsDatagridEasyUI
 * @Description: 获得datagrid中选中行的ids
 * @author: Double
 * @param: idFields [idField1, idField2, ...]
 * 
 */
jQuery.fn.getIdsDatagridEasyUI = function() {
	if (arguments.length === 1) {
		var rows = $(this).datagrid('getChecked'), idFields = arguments[0], ids = [];
		rows = rows.length ? rows : $(this).datagrid('getRows');
		for (var i=0; i<rows.length; i++) {
			if (idFields.length > 1) {
				var obj = new Object();
				for (var j=0; j<idFields.length; j++) {
					obj[idFields[j]] = rows[i][idFields[j]];
				}
				ids.push(obj);
			} else {
				ids.push(rows[i][idFields[0]]);
			}
		}
		$(this).datagrid('clearChecked');
		return JSON.stringify(ids);
	} else {
		$xcAlert("getIdsDatagridEasyUI : 参数错误, 支持1个参数(idFields)", $xcAlert.typeEnum.error);	
	}
} 
/**
 * 
 * @functionName: getIdsGetChecked
 * @Description: 获得datagrid中选中行的ids(通过用户选择数据后下载, 否则提示未选择数据)
 * @author: haliluya
 * @param: idFields [idField1, idField2, ...]
 * 
 */
jQuery.fn.getIdsGetChecked = function() {
	if (arguments.length === 1) {
		var rows = $(this).datagrid('getChecked'), idFields = arguments[0], ids = [];
		if(rows && rows.length > 0){
			for (var i=0; i<rows.length; i++) {
				if (idFields.length > 1) {
					var obj = new Object();
					for (var j=0; j<idFields.length; j++) {
						obj[idFields[j]] = rows[i][idFields[j]];
					}
					ids.push(obj);
				} else {
					ids.push(rows[i][idFields[0]]);
				}
			}
			$(this).datagrid('clearChecked');
			return JSON.stringify(ids);
		}else{
			return '';
		}
	} else {
		$xcAlert("getIdsGetChecked : 参数错误, 支持1个参数(idFields)", $xcAlert.typeEnum.error);	
	}
} 
/**
 * 
 * @functionName: loadFormSpan
 * @Description: 将值批量填充到表单的span标签中
 * @author: haliluya
 * 
 */
jQuery.fn.loadFormSpan = function() {
	var spanEle = $(this).find('span');
	$.each(arguments[0],function(index, field){
		var spanEleName = index;
		$.each(spanEle, function(index,filed){
			if($(spanEle[index]).attr('name') == spanEleName){
				$(spanEle[index]).html(field);
			}
		});
	});
} 

/**
 * @functionName: conditionOperatingEasyUI
 * @Description: 基于easyui datagrid的条件操作
 * @author: Double
 * @param: idFields [idField1, idField2, ...]-必填, noCondition-选填
 */
jQuery.fn.conditionOperatingEasyUI = function() {
	if (arguments.length >= 1 && arguments.length <= 2) {
		var conditionOperatingObj = {operate_type : '01'};
		if($(this).parents('.datagrid-view').next().find('.conditionSwitch').length && ($(this).parents('.datagrid-view').next().find('.conditionSwitch').switchbutton('options').checked)) { 
			//如果条件操作：on
			if (arguments[1] !== 'noCondition') {
				conditionOperatingObj.operate_type = '02';
				conditionOperatingObj.params = JSON.stringify(serializeObject($(this).parents('.datagrid').prevAll('.searchForm:eq(0)')));
				return {msg: '确定要按查询条件', data: conditionOperatingObj};
			} else {
				$xcAlert("此功能需要关闭条件操作。", $xcAlert.typeEnum.error);	
			}
		} else {
			var rows = $(this).datagrid('getChecked');
			if (rows.length) {
				var idFields = arguments[0], ids = [];
				for (var i=0; i<rows.length; i++) {
					if (idFields.length > 1) {
						var obj = new Object();
						for (var j=0; j<idFields.length; j++) {
							obj[idFields[j]] = rows[i][idFields[j]];
						}
						ids.push(obj);
					} else {
						ids.push(rows[i][idFields[0]]);
					}
				}
				var data = JSON.stringify(ids);
				if($(this).parents('.datagrid-view').next().find('.conditionSwitch').length) {
					conditionOperatingObj.params = data;
					data = conditionOperatingObj;
				}
				return {msg: '共选择' + ids.length + '条数据，确认要', data: data};
			} else {
//				$xcAlert("请选择要操作的数据。", $xcAlert.typeEnum.warning);
			}
		}
	} else {
		$xcAlert("batchOperatingEasyUI : 参数错误, 支持2个参数(idFields-必填, noCondition-选填)", $xcAlert.typeEnum.error);
	}
} 
/**
 * 
 * @functionName: filter
 * @Description: combobox 数据模糊查询方法(任意位置匹配)
 * @author: haliluya
 * @param: 
 * 
 */
$.fn.combobox.defaults.filter = function(q, row){
	var opts = $(this).combobox('options');
	return row[opts.textField].indexOf(q) >= 0; 
}
/**
 * 
 * @functionName: 
 * @Description: datagrid a 元素动画效果
 * @author: Double
 * @param: 
 * 
 */
//$(document).on('mouseenter', 'div.datagrid-body div.datagrid-cell a', function() {
//	$(this).text('[' + $(this).text() + ']');
//});
//$(document).on('mouseleave', 'div.datagrid-body div.datagrid-cell a', function() {
//	$(this).text($(this).text().replace('[', '').replace(']', ''));
//});

//easyUI验证扩展
//说明: easyUI自带验证有以下4个,有其他需要的在此处扩展
//	a. email：匹配E-Mail的正则表达式规则。
//	b. url：匹配URL的正则表达式规则。
//	c. length[0,100]：允许在x到x之间个字符。
//	d. remote['http://.../action.do','paramName']：发送ajax请求需要验证的值，当成功时返回true。
$.extend($.fn.validatebox.defaults.rules, {
	remote: {
		validator: function(value, url) {
			if($(this).next().has('textMark') && value == $(this).next().text()) {
				return true;
			} else {
				var data = {};
				data[this.name] = value;
				var response = $.ajax({
					url: contextPath + url[0],
					dataType: 'json',
					data: data,
					async: false,
					cache: false,
					type: 'post'
				}).responseText;
				response = $.parseJSON(response);
				return (response && response.errCd === 0 && response.result && response.result.success);
			}
		},
		message: '此名称已被占用'
	},
	equals: {    
        validator: function(value, param){    
        	console.info(value+"****"+param);
            return value == $(param[0]).val();    
        },    
        message: '两次输入的密码不相同'   
    },   
	code: {
		validator: function(value) {
			return /^[0-9a-zA-Z\-_,.\s　]+$/.test(value); 
		},
		message: '只能填写字母、数字、下划线'
	},   
	chinese: {
		validator: function(value) {
			return /^[\u4e00-\u9fa5\-_，。\（）\s　]*$/.test(value); 
		},
		message: '只允许中文'
	},
	japanese: {
		validator: function(value) {
			return /^[\u0800-\u9fa5\-_、。\（）\s　]*$/.test(value); 
		},
		message: '只允许日文'
	},
	english: {
		validator: function(value) {
			return /^[0-9A-Za-z\-_,.:\""\&\()\s　]+$/.test(value); 
		},
		message: '只能填写英文、数字'
	},   
	integer: {
		validator: function(value) {
			return /^[+]?[0-9]+\d*$/.test(value); 
		},
		message: '只能填写整数'
	},
	number: {
		validator: function(value) {
			return /^([1-9]\d{0,3}|10000)$/.test(value); 
		},
		message: '只能填写1-8000整数'
	},
	decimal: {
		validator: function(value) {
			return /^\d{1,7}\.?\d{0,2}$/.test(value); 
		},
		message: '小数点后面最多填写两位'
	},
	decimalthree: {
		validator: function(value) {
			return /^\d{1,9}\.?\d{0,3}$/.test(value); 
		},
		message: '小数点后面最多填写三位'
	}, 
	decimalfour: {
		validator: function(value) {
			return /^\d{1,5}\.?\d{0,4}$/.test(value); 
		},
		message: '小数点后面最多填写四位'
	},  
	zip: {
		validator: function(value) {
			return /^\d{6,7}$/.test(value); 
		},
		message: '请输入正确邮编'
	},
	faxno: {
		validator: function(value) {
			return  /^(?!-)[0-9\-]{5,20}$/.test(value); 
		},
		message: '请输入正确传真号'
	}, 
	phone: {
		validator: function(value) {
			return  /^(?!-)[0-9\-]{5,20}$/.test(value);
		},
		message: '请输入正确电话号'
	},
	oneInteger: {
		validator: function(value) {
			return /^[+]?[1-9]+\d*$/.test(value); 
		},
		message: '只能填写1-9整数'
	},
	nInteger:{		
		validator: function(value) {
			return /^\d{n}$/.test(value);   
		},
		message: '只能填写数字'
	},
	minLength: {     
		validator: function(value, param){   //value 为需要校验的输入框的值 , param为使用此规则时存入的参数
          return value.length >= param[0];     
		},     
        message: '请输入最小{0}位字符.'    
	}     
});
/**
 * @functionName: endTimeToStartTime
 * @Description: 时间插件起始与结束日期限制
 * @author: haliluya
 */
$.extend($.fn.validatebox.defaults.rules, {
	endTimeToStartTime: {
		validator: function(value, param) {
			if (value != null && value != "") {
				var startTime2 = $(param[0]).datetimebox('getValue');
				var d1 = $.fn.datebox.defaults.parser(startTime2);
				var d2 = $.fn.datebox.defaults.parser(value);
				varify = d2 >= d1;
				return varify;
			}
			return true;
		},
		message: '終了時間を開始時間の前にしてください！'
	},
	startTimeToEndTime: {
		validator: function(value, param) {
			if (value != null && value != "") {
				var endTime2 = $(param[0]).datetimebox('getValue');
				var d1 = $.fn.datebox.defaults.parser(endTime2);
				var d2 = $.fn.datebox.defaults.parser(value);
				varify = d2 <= d1;
				return varify;
			}
			return true;
		},
		message: '終了時間を開始時間の前にしてください！'
	}
});

/**
 * @functionName: hideAllValidation
 * @Description: 隐藏easyui的所有验证红框
 * @author: Double
 */
jQuery.fn.hideAllValidation = function() {
	$(this).find('.validatebox-invalid').removeClass('validatebox-invalid').end().find('.textbox-invalid').removeClass('textbox-invalid');
} 

$(function() {
	//消除验证红框
	$('form').hideAllValidation();
	
	//点击查询按钮，datagrid clear chenked
	$('.searchForm').prev('.searchBtns').children('button:eq(0)').click(function() {
		$('#' + $('.acticle .datagrid:eq(0) .datagrid-view').children('table').attr('id')).datagrid('clearChecked');
	});
	
	//所有验证的时间间隔为1000ms
	if ($('.easyui-validatebox').length) {
		$('.easyui-validatebox').validatebox('options').delay = 1000;
	}
	
});