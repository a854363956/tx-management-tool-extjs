/**
 * 打印方案维护
 * 
 * @returns
 */
(function(){
	var grid,addData;
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
	var inputjson = Tx.Window.create({
		title : "测试数据",
	    closable : false,
	    width : "40%",
	    height : "300px",
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    items:[{
	    	xtype:"form",
	    	id:"__print_program_maintenance_page_form_json",
	    	layout : "form", // 整个大的表单是form布局
	        labelAlign : "right",
	    	items:[{
		    	layout: {
		    	    type: 'table',
		    	    columns: 1
		    	},
		    	border:0,
		    	defaults:{
		    		allowBlank : false,
					xtype : 'textfield',
					padding :"0px 0px 0px 5px",
					labelWidth:80,
		    	},
		    	items:[{
	    			 	xtype : 'fieldset',
					    title : '请输入JSON格式的测试数据!',
					    collapsible : false,
					    autoHeight : true,
					    autoWidth : true,
					    colspan:3,
	    			 	items:[{
	 				    	xtype:"jstextarea",
	 				    	name:"content",
	 				    	width:"100%",
	 				    	height:200,
	 				    }]
	    		 }]
	    	}]
	    }],
	    buttons:[{
	    	xtype : "button",
			text : "直接打印",
			listeners:{
				click:function(){
					if(Ext.getCmp("__print_program_maintenance_page_form_json").isValid()){
						var da_ = Ext.getCmp("__print_program_maintenance_page_form_json").getForm().getValues();
						try {
							var datas = Ext.JSON.decode(da_.content);
							var selection = grid.getView().getSelectionModel().getSelection()[0];
							if(typeof(selection)!="undefined"){
								var printid =selection.data.id;
								Tx.Print.fnPrintDirectly({
									printid:printid,
									datas:datas
								});
							}else{
								Tx.MesssageBox.error("未选中数据,无法进行操作!");
							}
						} catch (e) {
							console.log(e);
							Tx.MessageBox.error(e.message);
						}
						
					}
				}
			}
	    },"-",{
			xtype : "button",
			text : "预览打印",
			listeners:{
				click:function(){
					if(Ext.getCmp("__print_program_maintenance_page_form_json").isValid()){
						var da_ = Ext.getCmp("__print_program_maintenance_page_form_json").getForm().getValues()
						try {
							var datas = Ext.JSON.decode(da_.content);
							var selection = grid.getView().getSelectionModel().getSelection()[0];
							if(typeof(selection)!="undefined"){
								var printid =selection.data.id;
								Tx.Print.fnPrintPreview({
									printid:printid,
									datas:datas,
									dom:addData
								});
								inputjson.hide();
							}else{
								Tx.MesssageBox.error("未选中数据,无法进行操作!");
							}
						} catch (e) {
							console.log(e);
							Tx.MessageBox.error(e.message);
						}
					
						
					}
				}
			}
	    },"-",{
	    	xtype:"button",
	    	text:"返回",
	    	listeners:{
	    		click:function(){
	    			inputjson.hide();
	    		}
	    	}
	   }]
	});
	addData =Tx.Window.create({
		title : "打印方案设计",
	    closable : false,
	    width : "55%",
	    height : "80%",
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    items:[{
	    	xtype:"form",
	    	id:"__print_program_maintenance_page_form",
	    	layout : "form", // 整个大的表单是form布局
	        labelAlign : "right",
	    	items:[{
		    	layout: {
		    	    type: 'table',
		    	    columns: 3
		    	},
		    	border:0,
		    	defaults:{
		    		allowBlank : false,
					xtype : 'textfield',
					padding :"0px 0px 0px 5px",
					labelWidth:80,
		    	},
		    	items:[{
		    			fieldLabel : '${id}',
		    			name:"id",
		    			hidden:true,
		    			allowBlank:true
	    		 },{
	    			 	fieldLabel : '${printname}',
	    			 	name:"printname",
	    		 },{
	    			    readOnly:true,
	    			 	fieldLabel : '${createdate}',
	    			 	name:"createdate",
	    		 },{
	    			 	readOnly:true,
	    			 	fieldLabel : '${updatedate}',
	    			 	name:"updatedate",
	    		 },{
	    			 	xtype : 'fieldset',
					    title : '打印报表模版信息',
					    collapsible : false,
					    autoHeight : true,
					    autoWidth : true,
					    colspan:3,
	    			 	items:[{
	 				    	xtype:"xmltextarea",
	 				    	name:"content",
	 				    	width:"100%",
	 				    	height:400,
	 				    }]
	    		 }]
	    	}]
	    }],
	    buttons:[{
			xtype : "button",
			text : "保存",
			listeners:{
				click:function(){
					if(Ext.getCmp("__print_program_maintenance_page_form").isValid()){
						var datas = Ext.getCmp("__print_program_maintenance_page_form").getForm().getValues()
						Tx.AjaxRequest.post({
							cmd:"spring:baseSystemBusiness#fnSavePrintPage",
							datas:datas,
							dom:addData,
							callback:function(result){
								Tx.MessageBox.info("保存成功!");
								grid.store.load();
								addData.hide();
							}
						});
					}
				}
			}
	    },"-",{
	    	xtype:"button",
	    	text:"返回",
	    	listeners:{
	    		click:function(){
	    			addData.hide();
	    		}
	    	}
	   }]
	});
	Tx.auto.TxGrid.getGrid({
		sqlid:"40a87a416f6d4670b3206827ee31a76e",
		items:[{
			text:"测试打印方案",
			iconCls:"fa fa-bug",
			handler:function(){
				inputjson.show();
			}
		},"-",{
			text:"新增打印方案",
			iconCls : "fa fa-plus-circle",
			handler:function(){
				Ext.getCmp('__print_program_maintenance_page_form').form.reset()
				Ext.getCmp('__print_program_maintenance_page_form').form.setValues({
					createdate:Ext.util.Format.date(new Date(),"Y-m-d H:i:s"),
					updatedate:Ext.util.Format.date(new Date(),"Y-m-d H:i:s"),
					id:window.GUID(),
					printname:""
				});
				addData.show();
			}
		},"-",{
			text:"移除打印方案",
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
		queryname:"printname",
		callback:function(printgrid){
			grid = printgrid;
			printgrid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
				record.data.createdate = Ext.util.Format.date(new Date(record.data.createdate),"Y-m-d H:i:s");
				record.data.updatedate = Ext.util.Format.date(new Date(record.data.updatedate),"Y-m-d H:i:s");
				Ext.getCmp("__print_program_maintenance_page_form").getForm().setValues(record.data);
				addData.show();
			});
			center.add(printgrid);
		}
	});
	return cmp;
})();