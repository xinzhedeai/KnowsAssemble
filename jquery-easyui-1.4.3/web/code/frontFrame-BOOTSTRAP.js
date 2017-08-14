
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

/**
 * 提取模态框下增加和修改的公用方法
 * var funcObj = {},
 * funcObj.add = $commodity.addCommod, //添加方法
 * funcObj.mod = $commodity.modifyCommod;//修改方法
 * confirmFunc($commodity.commodityModal, $(this), funcObj);//将两种方法放到对象中直接交给公用方法使用
 */
function confirmFunc(){
	var modalEle = arguments[0], targetBtn = arguments[1], callback = arguments[2]; 
	if ($(modalEle).find('form').form('validate')) {
		if (targetBtn.parents('.modal').hasClass('editForm')) {
			var option = {
				btn : parseInt("0011", 2),
				onOk : function() {
					callback.mod();
				},
				onCancel : function() {
					clearModalForm(modalEle);
				}
			}
			$xcAlert("确定修改？", $xcAlert.typeEnum.info, option);
		} else {
			var option = {
				btn : parseInt("0011", 2),
				onOk : function() {
					callback.add();
				},
				onCancel : function() {
					clearModalForm(modalEle);
				}
			}
			$xcAlert("确定添加？", $xcAlert.typeEnum.info, option);
		}
	}
}

/***
 * 根据不同需求,对操作数据进行限制,然后弹窗信息提醒
 * 结果对象validRes,如果flag值为false，则数据操作不合法，进行提示，否则可以操作，并且row里面存着要操作的数据
 * 
 * 使用方法：
 * var validRes = validateRow($commodity.commodityDatagrid, 'multi');
	if (validRes.flag){
		var row = validRes.row;
		var option = {
			title : '操作提示',
			btn : parseInt('0011', 2),
			onOk : function() {
				var idFields = [ 'commodity_number', 'commodity_sku', 'supplier_id' ], commdIds = $($commodity.commodityDatagrid).getIdsDatagridEasyUI(idFields);
				$commodity.delCommod(commdIds);
			}
		};
		$xcAlert('确认删除？', $xcAlert.typeEnum.info, option);
	}
 */
function validateRow() {
	var grid = arguments[0], type = arguments[1], returnObj = {}, row = $(grid).datagrid('getChecked'), flag = true;
	switch (type){
		case 'multi'://没有选择一条或多条数据的情况
			if (row == null || row.length < 1) {
				flag = false;
				$xcAlert('您还未选择要操作的数据', $xcAlert.typeEnum.info);
			}
			break;
		case 'single'://类似于修改时，只能同时操作一条数据的情况
			if (row && row.length != 1) {
				flag = false;
				$xcAlert('请选择一条数据进行操作', $xcAlert.typeEnum.info);
			}
			break;
		case 'unNull'://根据添加订单时，网格数据不能为空
			row = $(grid).datagrid('getRows');
			if (row == null || row.length < 1) {
				flag = false;
				$xcAlert('列表中数据为空,请添加后进行操作', $xcAlert.typeEnum.info);
			}
			break;
		default : 
			break;
	}
	returnObj.row = row;
	returnObj.flag = flag;
	return returnObj;
};