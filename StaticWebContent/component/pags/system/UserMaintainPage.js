/**
 *人员信息维护 
 **/
(function(window){
	
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
		sqlid:"aaad775d0f164d28b726bf96cd2d9dbf",
		callback:function(result){
			
			var grid= Tx.auto.TxGrid.getTxGrid({
				items:[{
					text : "新增字段方言",
					iconCls : "fa fa-plus-circle",
					handler:function(){
						addData.show();
				    }
				},{
					text : "删除数据",
					iconCls : "fa fa-minus-circle",
					handler:function(){
						Tx.MessageBox.question("您确定要删除当前选中的数据,删除数据后无法重新恢复数据,是否确认?", function() {
							var selection = grid.getView().getSelectionModel().getSelection()[0];
							grid.store.remove(selection);
						});
					}
				}],
			 	 columns:result,
			     sqlid:"aaad775d0f164d28b726bf96cd2d9dbf"
			 });
			
			var addData =Ext.Window.create({
				title : "新增数据",
			    closable : false,
			    width : 750,
			    height : 100,
			    resizable : false, // 窗口可拖动改变大小;
			    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
			    plain : true, // 使窗体主体更融于框架颜色;
			    items:[{
			    	xtype:"form",
			    	id:"__add_user_maintain_page_form",
			    	layout : "form", // 整个大的表单是form布局
			        labelAlign : "right",
			    	items:[{
				    	layout: {
				    	    type: 'table',
				    	    columns: 4
				    	},
				    	border:0,
				    	defaults:{
				    		allowBlank : false,
							xtype : 'textfield',
							padding :"0px 0px 0px 4px",
							labelWidth:65,
				    	},
				    	items:[{
				    			fieldLabel : '字段名称',
				    			name:"name",
			    		 },{
			    			 	fieldLabel : '字段显示值',
			    			 	name:"label",
			    		 },{
			    			 	fieldLabel : '字段代号',
			    			 	name:"languagecode",
			    		 }]
			    	}]
			    }],
			    buttons:[{
					xtype : "button",
					text : "保存",
					listeners:{
						click:function(){
							if(Ext.getCmp("__add_user_maintain_page_form").isValid()){
								var datas = Ext.getCmp("__add_user_maintain_page_form").getForm().getValues()
								var store = grid.store;
								grid.store.add(datas);
								grid.store.sync();
								addData.hide();
							}
						}
					}
			    },{
			    	xtype:"button",
			    	text:"返回",
			    	listeners:{
			    		click:function(){
			    			addData.hide();
			    		}
			    	}
			   }]
			});
			center.add(grid);
			cmp._destroy=function(){
				addData.destroy();
			}
		}
	});
	return cmp;
})(window);