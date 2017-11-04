/**
 *  角色信息维护
 */
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
	var b =  Ext.Panel.create({
		region : 'south',
		height : "60%",
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
		items:[center,b]
	});
	var addData;
	var grid;
	Tx.auto.TxGrid.getGrid({
		sqlid:"d3a699f848d347a581120681028199a1",
		items:[{
			text : "新增角色",
			iconCls : "fa fa-plus-circle ",
			handler:function(){
				Ext.getCmp('__character_maintain_page_form').form.reset()
				Ext.getCmp("__character_maintain_page_form").getForm().setValues({
					create_datetime:Ext.util.Format.date(new Date(),"Y-m-d H:i:s"),
					role_state:"0",
				});
				addData.show();
			}
		},{
			text:"删除角色",
			iconCls : "fa fa-minus-circle ",
			handler:function(){
				var selection = grid.getView().getSelectionModel().getSelection()[0];
				if(typeof(selection)!="undefined"){
					Tx.MessageBox.question("您确定要删除当前选中的数据,删除数据后无法重新恢复数据,是否确认?", function() {
						grid.store.remove(selection);
						grid.store.load();
					});
				}else{
					Tx.MesssageBox.error("未选中数据,无法进行操作!");
				}
			}
		}],
		queryname:"role_name",
		callback:function(rolegrid){
			grid=rolegrid;
			center.add(rolegrid);
			Tx.auto.TxGrid.getGrid({
				sqlid:"905258cfbe6d49d0a240927453b25539",
				callback:function(result){
					
					//rowclick
					rolegrid.addListener("rowclick",function(self, record, element, rowIndex, e, eOpts){
						var proxy = result.store.getProxy();
						proxy.setExtraParams({
							"conditionName":"roleid",
							"conditionValue":record.data.id,
							"conditionSymbol":"2",
						});
						result.store.load();
						
					});
					
					var selection = rolegrid.getView().getSelectionModel().getSelection()[0];
					if(typeof(selection)=="undefined"){
						var proxy = result.store.getProxy();
						proxy.setExtraParams({
							"conditionName":"id",
							"conditionValue":"NULL",
							"conditionSymbol":"2",
						});
						result.store.load();
						b.add(result);
					}
					
					
					addData =Tx.Window.create({
						title : "新增数据",
					    closable : false,
					    width : 750,
					    height : 105,
					    resizable : false, // 窗口可拖动改变大小;
					    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
					    plain : true, // 使窗体主体更融于框架颜色;
					    items:[{
					    	xtype:"form",
					    	id:"__character_maintain_page_form",
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
						    			fieldLabel : '${id}',
						    			name:"id",
						    			hidden:true,
						    			allowBlank:true
					    		 },{
					    			 	fieldLabel : '${role_name}',
					    			 	name:"role_name",
					    		 },{
					    			 	fieldLabel : '${role_state}',
					    			 	name:"role_state",
					    			 	xtype:'combo',
										editable:false,
										store:[['0','正常'],['1','禁止']],
										value:'0',
					    		 },{
					    			 	readOnly:true,
					    			 	fieldLabel : '${create_datetime}',
					    			 	name:"create_datetime",
					    		 }]
					    	}]
					    }],
					    buttons:[{
							xtype : "button",
							text : "保存",
							listeners:{
								click:function(){
									debugger;
									if(Ext.getCmp("__character_maintain_page_form").isValid()){
										var datas = Ext.getCmp("__character_maintain_page_form").getForm().getValues()
										var store = rolegrid.store;
										rolegrid.store.add(datas);
										rolegrid.store.sync();
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
					
					cmp._destroy=function(){
						addData.destroy();
					}
				}
			});
		}
	});
	return cmp;
})();