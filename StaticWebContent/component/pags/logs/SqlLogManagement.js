/**
 * SQL日志管理
 * @returns
 */
(function(){
	//@Grid("7fa2f7833a064aa6ad22248b1b3e066f")
	var grid;
	grid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
		record.data.createdate = Ext.util.Format.date(new Date(record.data.createdate),"Y-m-d H:i:s");
		Ext.getCmp("__sql_logs_program_maintenance_page_form_json").getForm().setValues(record.data);
		addData.show();
	});
	
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
		items:[grid]
	});
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[center]
	});
	var addData = Tx.Window.create({
		title : "SQL信息",
	    closable : false,
	    width : "50%",
	    height : 600,
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    dockedItems:[{
	    	xtype: "toolbar",
	    	dock:"top",
	    	items:[{
	    		xtype: 'button',
	    		iconCls:"fa fa-leaf",
	    		text: '美化SQL语句',
	    		handler:function(){
	    			var datas = Ext.getCmp("__sql_logs_program_maintenance_page_form_json").getForm().getValues();
	    			datas.realsql =sqlFormatter.format(datas.realsql);
	    			Ext.getCmp("__sql_logs_program_maintenance_page_form_json").getForm().setValues(datas);
	    		}
	    	}]
	    }],
	    items:[{
	    	xtype:"form",
	    	id:"__sql_logs_program_maintenance_page_form_json",
	    	layout : "form", // 整个大的表单是form布局
	        labelAlign : "right",
	    	items:[{
		    	layout: {
		    	    type: 'table',
		    	    columns: 2
		    	},
		    	border:0,
		    	defaults:{
		    		allowBlank : false,
					xtype : 'textfield',
					padding :"0px 0px 0px 5px",
					labelWidth:80,
		    	},
		    	items:[{
			    			fieldLabel : '${threadid}',
			    			name:"threadid",
			    			allowBlank:true,
			    			readOnly:true
		    		 },{
			    			fieldLabel : '${actual_name}',
			    			name:"actual_name",
			    			allowBlank:true,
			    			readOnly:true
		    		 },{
			    			fieldLabel : '${sqltiming}',
			    			name:"sqltiming",
			    			allowBlank:true,
			    			readOnly:true
		    		 },{
			    			fieldLabel : '${createdate}',
			    			name:"createdate",
			    			allowBlank:true,
			    			readOnly:true
		    		 },{
			    			 	xtype : 'fieldset',
							    title : 'SQL信息',
							    collapsible : false,
							    autoHeight : true,
							    autoWidth : true,
							    colspan:2,
			    			 	items:[{
			 				    	xtype:"sqltextarea",
			 				    	readOnly:true,
			 				    	name:"realsql",
			 				    	width:"100%",
			 				    	height:400,
			 				    }]
	    		 }]
	    	}]
	    }],
	    buttons:[{
	    	xtype:"button",
	    	text:"返回",
	    	listeners:{
	    		click:function(){
	    			addData.hide();
	    		}
	    	}
	   }]
	});
/*	Tx.auto.TxGrid.getGrid({
		sqlid:"7fa2f7833a064aa6ad22248b1b3e066f",
		queryname:"threadid",
		callback:function(printgrid){
			grid = printgrid;
			printgrid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
				record.data.createdate = Ext.util.Format.date(new Date(record.data.createdate),"Y-m-d H:i:s");
				Ext.getCmp("__sql_logs_program_maintenance_page_form_json").getForm().setValues(record.data);
				addData.show();
			});
			center.add(printgrid);
		}
	});*/
	cmp._destroy=function(){
		addData.destroy();
	}
	return cmp;
})();