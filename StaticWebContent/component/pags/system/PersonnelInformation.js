(function(){
	var center = Ext.Panel.create({
		region : 'center',
		layout:{  
	        type:'hbox',  
	        align : 'stretch',  
	        pack  : 'start'  
	    },  
	    defaults:{  
	       flex:1  
	    },  
		items:[]
	});
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[center]
	});
	Tx.auto.TxGrid.getColumns({
		sqlid:"905258cfbe6d49d0a240927453b25539",
		callback:function(result){
			var grid= Tx.auto.TxGrid.getTxGrid({
				items:[{
					text : "变更角色",
					iconCls : "fa fa-share",
					handler:function(){
						//addData.show();
				    }
				},{
					text : "新增人员",
					iconCls : "fa fa-plus-circle",
					handler:function(){
						/*Tx.MessageBox.question("您确定要删除当前选中的数据,删除数据后无法重新恢复数据,是否确认?", function() {
							var selection = grid.getView().getSelectionModel().getSelection()[0];
							grid.store.remove(selection);
						});*/
					}
				}],
			 	 columns:result,
			     sqlid:"905258cfbe6d49d0a240927453b25539"
			 });
			center.add(grid);
		}
	});
	return cmp;
})();