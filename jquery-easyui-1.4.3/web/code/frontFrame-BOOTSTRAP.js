
/**
 * 这里是在进行bootstrap和easyui以及修改添加和显示数据融合弹窗方法的例子。
 * 实际使用需要结合FuncAssemble-Js.js中的方法
 */
<div class="modal noHideForm" id="warehouseModal">
	<div class="modal-dialog">
		<div class="modal-content downModal mlWidth">
			<div class="modal-header">
				<button type="button" class="close btnClose" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title">哈利路亚</h4>
			</div>
			<div class="modal-body">
				<form class="modalForm">
					<table class="table table-bordered">
						<col width="140" />
						<col width="200" />
						<col width="120" />
						<col width="200" />
						<tbody>
							<tr>
								<th>公司名称:</th>
								<td><input type="text" maxLength="25" name="warehouse_name" class="formControl easyui-validatebox" data-options="required:true" /></td>
								<th>公司状态:</th>
								<td>
									<select class="formControl" name="warehouse_status">
										<option value="Y" class="i18n" name="active" seleted>已激活</option>
										<option value="N" class="i18n" name="negative">未激活</option>
									</select>
								</td>
							</tr>
							<tr>
								<th>负责人名:</th>
								<td><input type="text" maxLength="15" name="warehouse_person" class="formControl easyui-validatebox" data-options="required:true" /></td>
								<th>负责人电话:</th>
								<td><input type="text" maxLength="15" name="warehouse_person_tel" class="formControl easyui-validatebox" data-options="required:true,validType:'phone'" /></td>
							</tr>
							<tr>
								<th>备注:</th>
								<td colspan="3"><input type="text" maxLength="35" name="remark" class="formControl" /></td>
							</tr>
						</tbody>
					</table>
				</form>
			</div>
			<div class="modal-footer modal-footer-center">
				<button type="button" class="btn btn-info hideEle btnEdit">修改</button>
				<button type="button" class="btn btn-info btnOk">确认</button>
				<button type="button" class="btn btn-default btnBack">关闭</button>
			</div>
		</div>
	</div>
</div>

	$(function(){
		/**
		 * 模态框编辑按钮
		 */
		$('.btnEdit').click(function(){
			var $modal = $(this).parents('.modal');
			if($modal.length){
				$modal.addClass('editForm').addClass('noHideForm').showForm();
			}else{
				$(this).parent().next().find('form').showForm();//页面详情的表单显示
			}
			$(this).hide().siblings().show();
		});
		
		$('.btnBack,.btnClose').click(function(){//模态框取消按钮
			var $modal = $(this).parents('.modal');
			if($modal.length){
				if(!($modal.hasClass('noHideForm'))){
					$modal.addClass('noHideForm');
					$modal.initForm();
				}
				if($modal.hasClass('editForm')){
					$modal.removeClass('editForm').hideForm();
					$(this).parents('.modal-content').find('.modal-footer-center').children().hide();
					$('.btnEdit').show();
				}else{
					clearModalForm($modal);//重置表单，模态框消失 
				}
			}else{
				var $edit = $(this).parent().find('button').first();
				$edit.show().nextAll().hide();
				$('#back').show();
				$(this).parent().next().find('form').hideForm();//页面编辑  
			}
		});
	})

function clearModalForm(){
	var modalEle = arguments[0];
	$(modalEle).find('form').form('reset');
	$(modalEle).modal('hide');
}

/**
 * 模态框表单进行显示处理方法
 * 使用方法：
 * $('#buttonId').click(function() {
		modalFormInit('#弹窗id', 'before');
	});
	modalFormInit('#弹窗id', 'after');
 */
function modalFormInit(){
	var modalEle = arguments[0], type = arguments[1];
	switch (type){
		case 'before' ://点击按钮初始化
			$(modalEle).removeClass('editForm');
			if ($(modalEle).hasClass('noHideForm')) {
				$(modalEle).modal().initForm();
			} else {
				$(modalEle).modal().addClass('noHideForm').find('form').showForm();
			}
			$(modalEle).find('form').form('reset');//这里面使用的easyui的重置表单方法，详情请看easyui文档reset
			break;
		case 'after' ://模态框完全显示后回调函数
			$(modalEle).on('show.bs.modal', function() {// 模态框显示回调函数
				if ($(this).hasClass('noHideForm')) {
					$('.btnBack, .btnOk', modalEle).show();
					$('.btnEdit', modalEle).hide();
				} else {
					$('.btnEdit', modalEle).show();
					$('.btnBack, .btnOk', modalEle).hide();
				}
			});
			break;
		default :
			break;
	}
	
}
function loadDetail (row) {// 通过点击easyui grid的行数据加载详情
	a = $.parseJSON(row).warehouse_id;
	$('modal').removeClass('noHideForm').modal();
	$('modal').find('form').form('clear').initForm();// 表单初始化
	$('modal').form('load', $.parseJSON(row));//easyui的表单重载方法load，十分好用的 方法
	$('modal').find('form').hideForm();// 隐藏输入框
}



