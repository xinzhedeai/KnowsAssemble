'use strict';

/**
 * @functionName: fileUpload
 * @Description: 文件上传扩展方法
 * @param: options
 * 使用方法:
 * <div class="productImgDiv"></div>
   <button type="button" class="btn btn-default uploadProductImg">选择文件</button>
   $('.uploadProductImg').click(function(){//商品图片上传功能
		var $uploadModal = $('#uploadImgDiv');
		$('#uploadCommdImgModal').modal();
		$uploadModal.fileUpload();
		$uploadModal.plupload('getUploader').setOption('url', contextPath + $uploadModal.attr('url') + '?company_id=' + $commodity.companyid);
	});
   
 */
jQuery.fn.fileUpload = function() {
	if (arguments.length < 2) {
		if (arguments.length === 0) { //init or open
			var previewtag = $(this).attr('previewtag');
			previewtag = previewtag ? previewtag : 'ul.picList';
			if ($(previewtag).length > 1) { //一次指定了多个文件预览区
				$xcAlert("指定了多个图片预览区", $xcAlert.typeEnum.info);
			} else {
				var module_cd, module_no, extensions, max_file_size, multi, requestUrl, params, paramsObj = {},
					headtitle, addtext, starttext, fileUploader = $(this);
				if (!$(previewtag).length) { //无文件预览区
					module_cd = $(this).attr('modulecd');
					module_no = $(this).attr('moduleno');
					extensions = $(this).attr('extensions');
					max_file_size = $(this).attr('size');
					multi = $(this).attr('multi');
					requestUrl = $(this).attr('url');
					params = $(this).attr('params');
					headtitle = $(this).attr('headtitle');
					addtext = $(this).attr('addtext');
					starttext = $(this).attr('starttext');
				} else {
					module_cd = $(previewtag).attr('modulecd');
					module_no = $(previewtag).attr('moduleno');
					extensions = $(previewtag).attr('extensions');
					max_file_size = $(previewtag).attr('size');
					multi = $(previewtag).attr('multi');
					requestUrl = $(previewtag).attr('url');
					params = $(previewtag).attr('params');
					headtitle = $(previewtag).attr('headtitle');
					addtext = $(previewtag).attr('addtext');
					starttext = $(previewtag).attr('starttext');
					$(this).attr('previewtag', previewtag);
				}
				extensions = extensions ? extensions.replace(/\s/g, '') : extensions;
				extensions = extensions ? extensions : 'jpg,jpeg,png,gif,bmp,tiff,raw,zip';
				max_file_size = max_file_size ? max_file_size : '500kb';
				multi = multi === 'false' ? false : true;
				requestUrl = requestUrl ? requestUrl : '/v1/api/common/upload-files.form';
				if (module_cd) {
					paramsObj.module_cd = module_cd;
				}
				if (module_no) {
					paramsObj.module_no = module_no;
				}
				if (params) {
					$.extend(paramsObj, $.parseJSON(params.replace(/\'/g, '"')));
				}
				var paramsStr = '';
				for (var i in paramsObj) {
					paramsStr += '&' + i + '=' + paramsObj[i];
				}
				if (paramsStr) {
					paramsStr = paramsStr.substr(1, paramsStr.length - 1);
					requestUrl += '?' + paramsStr;
				}
				if (!$(this).find('.plupload_wrapper').length) { //上传控件未定义
					var options_extend = {
						url: contextPath + requestUrl,
						filters: {
							mime_types: [{
								title: 'Image And Zip',
								extensions: extensions
							}],
							max_file_size: max_file_size
						},
						dragdrop: true,
						multi_selection: multi,
						flash_swf_url: 'lib/plugin/plupload-2.1.2/Moxie.swf',
						silverlight_xap_url: 'lib/plugin/plupload-2.1.2/MoxiDe.xap',
						views: {
							thumbs: true,
							list: true,
							active: 'thumbs'
						},
						init: {
							FileUploaded: function(uploader, file, responseObject) {
								var res = $.parseJSON(responseObject.response),
								plupload_header = $('#' + uploader.getOption('container')).parents('.plupload_container').children('.plupload_header'),
								uistate = 'highlight', msg = 'Success';
								if (res.errCd === 0) {
									var result = res.result;
									if (result) {
										var files = result.result;
										if (files) {
											var p = "<img src='";
												p += contextPath + files[0].image_path;
												p += "' width='75' height='75' class='img-thumbnail'>";
											$('.image_path').val(files[0].image_path);
											$(".productImgDiv").html(p);
											$('.image_id').val(files[0].image_id);
										} else { //导入
											if (!result.success) {
												uistate = 'error';
											}
											msg = result.msg;
										}
									}
								} else {
									uistate = 'error';
									msg = res.errMsg;
								}
								if (uistate === 'error') {
									plupload_header.nextAll('.plupload_content').find('ul.plupload_filelist_content li[id="' + file.id + '"]').addClass('ui-state-error').find('.ui-icon-circle-check').addClass('ui-icon-circle-close').removeClass('ui-icon-circle-check');
									$('#' + file.id).click(function(e) {//删除上传错误问件
										$('#' + file.id).remove();
										uploader.removeFile(file);
										e.preventDefault();
									});
								}
								var displayMsg = msg, tooltipId = Math.round(Math.random() * 100000);
								if (displayMsg.length > 110) {
									displayMsg = '<a id="errMsgTooltip' + tooltipId + '">' + displayMsg.substr(0, 110) + '......</a>';
								}
								plupload_header.append('' + 
								'<div class="plupload_message ui-state-' + uistate + '">' +
									'<span class="plupload_message_close ui-icon ui-icon-circle-close" title="关闭"></span>' +
									'<p>' +
										'<span class="ui-icon ui-icon-alert"></span><strong style="word-break: break-all;">' + displayMsg + '</strong><br/>' +
										'<i>文件: ' + file.name + '</i>' +
									'</p>' +
								'</div>');
								if (displayMsg.length > 110) {
									$('#errMsgTooltip' + tooltipId).tooltip({
						                content : '<p style="word-break: break-all; max-height: 100px; overflow-y: auto;">' + msg + '</p>',
						                hideEvent: 'none',
						                onShow : function() {
						                	var t = $(this);
						                    $(this).tooltip('tip').css({
						                    	width: 300,
						                    	color: '#cd0a0a',
						                    	left: t.offset().left + 380,
						                    	backgroundColor: '#fef7f5',
						                        borderColor: '#cd0a0a',
						                        boxShadow: '1px 1px 10px #292929'
						                    });
						                    $(this).tooltip('arrow').css({
						                    	left: t.offset().left - 330
						                    });
					                        t.tooltip('tip').focus().unbind().bind('blur',function(){
					                            t.tooltip('hide');
					                        });
						                }
						            });
								}
								plupload_header.find('.plupload_message_close').click(function() {
									$(this).parent().remove();
								});
							},
							FilesAdded: function(uploader, files) {
								if (!uploader.getOption('multi_selection')) {
									uploader.splice(0, uploader.files.length - 1);
								}
							},
							UploadComplete: function(uploader, files) {
								setTimeout(function() {
									$('#' + uploader.getOption('container')).parents('.plupload_container').find('.plupload_header .ui-state-highlight').remove();
								}, 3000);
							}
						}
					};
					if (navigator.userAgent.indexOf('MSIE 8.0') > 0) { //ie8不支持views属性
						options_extend.views = undefined;
					}
					$(this).plupload(options_extend);
					if (headtitle) {
						$(this).find('.plupload_header .plupload_header_content .plupload_header_title').text(headtitle);
					}
					if (addtext) {
						$(this).find('.plupload_filelist_footer .plupload_add .ui-button-text').text(addtext);
					}
					if (starttext) {
						$(this).find('.plupload_filelist_footer .plupload_start .ui-button-text').text(starttext);
						$(this).find('.plupload_header .plupload_header_content .plupload_header_text').text('将文件添加到上传队列，然后点击”' + starttext + '“按钮。');
					}
				}
			}
		} else { //method
			switch (arguments[0]) {
				case 'clearFiles':
					if (navigator.userAgent.indexOf('MSIE 8.0') < 0 && navigator.userAgent.indexOf('MSIE 9.0') < 0) { //ie8不支持views属性
						var uploader = $(this).plupload('getUploader');
						if(uploader.files && uploader.files.length > 0){
							uploader.splice(0, uploader.files.length);
						}
					}
					$('.plupload_message').remove();
					break;
			}
		}
	} else {
		$xcAlert("fileUpload : 参数错误, 支持1个参数(clearFiles)-可选", $xcAlert.typeEnum.error);
	}
};

/**
 * @functionName: previewPictures
 * @Description: 图片预览函数
 * @param: files [file1, file2, ...]
 */
jQuery.fn.previewPictures = function() {
	if (arguments.length === 1) {
		var previewtag = this,
			files = arguments[0];
		if (previewtag && $(previewtag).length === 1) {
			var files = arguments[0],
				multi = $(previewtag).attr('multi') === 'false' ? false : true;
			!multi ? $(previewtag).empty() : '';
			for (var i = 0; i < files.length; i++) {
				var imgName = files[i].file_nm + '.' + files[i].file_extension;
				if (imgName.length > 20) {
					imgName = imgName.substr(0, 7) + '...' + imgName.substr(imgName.length - 10, 10);
				}
				var itemImg;
				if (files[i].file_extension.toLowerCase() === 'zip') {
					itemImg = '<li>\
							   		<a title="点击删除文件" onclick="$(this).parent().remove();"><div class="picDel">&times;</div></a>\
									<a title="' + files[i].file_nm + '.' + files[i].file_extension + '" href="' + contextPath + '/storage/upload' + files[i].file_relative_path + files[i].file_id + '.' + files[i].file_extension + '" target="_blank">\
									<div class="pic"><div id="' + files[i].file_id + '">zip</div></div>\
									<div class="picName">' + imgName + '</div></a>\
							   </li>';
				} else {
					itemImg = '<li>\
							   		<a title="点击删除图片" onclick="$(this).parent().remove();"><div class="picDel">&times;</div></a>\
									<a title="' + files[i].file_nm + '.' + files[i].file_extension + '" href="' + contextPath + '/storage/upload' + files[i].file_relative_path + files[i].file_id + '.' + files[i].file_extension + '" target="_blank">\
									<div class="pic"><img id="' + files[i].file_id + '" src="' + contextPath + '/storage/upload' + files[i].file_relative_path + files[i].file_id + '.' + files[i].file_extension + '" onMouseOver="toolTip(\'<img height=400 width=400 src=' + contextPath + '/storage/upload' + files[i].file_relative_path + files[i].file_id + '.' + files[i].file_extension + '>\')" onMouseOut="toolTip()"/></div>\
									<div class="picName">' + imgName + '</div></a>\
							   </li>';
				}
				$(previewtag).append(itemImg);
			}
		} else {
			$xcAlert("previewPictures : 请指定唯一图片预览区域", $xcAlert.typeEnum.info);
		}
	} else {
		$xcAlert("previewPictures : 参数错误, 支持1个参数(files)", $xcAlert.typeEnum.error);
	}
}

/**
 * @functionName: getFileList
 * @Description: 获得页面上的所有文件，并封装成List
 * @param:
 */
function getFileList() {
	if (arguments.length === 0) {
		var files = [];
		$.each($('ul.picList'), function(index, value) {
			var module_cd = $(value).attr('modulecd'),
				module_no = $(value).attr('moduleno');
			var file_ids = [];
			$.each($(value).find('li'), function(i, li) {
				file_ids.push($(li).find('.pic').children().attr('id'));
			});
			var file = {};
			file.module_cd = module_cd;
			file.module_no = module_no;
			file.file_ids = file_ids;
			files.push(file);
		});
		return JSON.stringify(files);
	} else {
		$xcAlert("getFileList : 参数错误, 不支持参数", $xcAlert.typeEnum.error);
	}
}

/**
 * pluploder另一种调用方法,不在弹窗中调用,直接上传文件到指定路径接口中
 	方便,但是在ie8下会出现兼容性的问题
 */

	//pluploader实例
	var uploader = new plupload.Uploader({
		browse_button: 'feedback-pickfile',
		container: 'container',
		url: contextPath + '/v1/api/common/upload-files.form',
		multipart_params: {
			module_cd: '/suggestion/'
		},
		filters: {
			max_file_size: '500kb',
			mime_types: [{
				title: 'pictures',
				extensions: 'jpg,jpeg,gif,png'
			}, {
				title: 'files',
				extensions: 'zip,rar,txt,xls,xlsx'
			}]
		},
		flash_swf_url: '/lib/plugin/plupload-2.1.2/Moxie.swf',// Flash settings
		silverlight_xap_url: '/lib/plugin/plupload-2.1.2/Moxie.xap',// Silverlight settings
		init: {
			Init: function(up) {
				var navi = getNavigator();
				if(navi === 'IE 8.0' || navi === 'IE 9.0') {
					$('#container').find('.moxie-shim').css({width: 67, height: 25, top: 0});
				}
			},
			FilesAdded: function(up, files) {
				$('.feedback-body .feedback-content .tip').empty();
				var count = 3 - $('.feedback-body .feedback-content .filelist').children().length;
				for (var i=0; i<count && i<files.length; i++) {
					var file = files[i], name = file.name;
					if (name.length > 30) {
						name = name.substr(0, 12) + '...' + name.substr(name.length - 15, 15);
					}
					$('.feedback-body .feedback-content .filelist').append('<p title="' + file.name + '" id="' + file.id + '">' + name + ' (' + plupload.formatSize(file.size) + ')<i class="icon icon-remove-circle" title="删除"></i></p>');
				}
				$.each(files.slice(count), function(i, file) {
					uploader.removeFile(file);
				});
				up.start();
			},
			Error: function(up, err) {
				$('.feedback-body .feedback-content .tip').empty().append('<p class="file-error">Error #' + err.code + ': ' + err.message + '</p>');
			}
		}
	});
	uploader.init();