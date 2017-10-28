function main(){
	var addData=  Ext.Window.create({
		title : "新增SQL数据源",
	    closable : false,
	    width : "70%",
	    height : "88%",
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    dockedItems:[{
	    	xtype: "toolbar",
	    	dock:"top",
	    	items:[{
	    		xtype: 'button',
	    		iconCls:"fa fa-hand-pointer-o",
	    		text: '生成列的字段信息' 
	    	},"-",{
	    		xtype: 'button',
	    		iconCls:"fa fa-leaf",
	    		text: '美化SQL语句',
	    		handler:function(){
	    			var datas = Ext.getCmp("_usermaintainpage_form").getForm().getValues();
	    			datas.querysql =sqlFormatter.format(datas.querysql);
	    			datas.countsql =sqlFormatter.format(datas.countsql);
	    			Ext.getCmp("_usermaintainpage_form").getForm().setValues(datas);
	    		}
	    	},"-",{
	    		xtype:"button",
	    		iconCls:"fa fa-bug",
	    		text:"测试SQL语句"
	    	}]
	    }],
	    items:[{
	    	xtype:"form",
	    	id:"_usermaintainpage_form",
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
		    			fieldLabel : '数据源ID',
		    			name:"id",
		    			readOnly:true
	    		 },{
	    			 	fieldLabel : '数据源描述',
	    			 	name:"description",
	    		 },{
	    			 	fieldLabel : '创建日期',
	    			 	name:"createdate",
	    			 	readOnly:true,
	    			 	
	    		 },{
	    			 	fieldLabel : '修改日期',
	    			 	name:"updatetime",
	    			 	readOnly:true
	    		 },{
	    			 	xtype : 'fieldset',
					    title : '查询SQL数据源',
					    collapsible : false,
					    autoHeight : true,
					    autoWidth : true,
					    colspan:2,
					    items:[{
					    	xtype:"textareafield",
					    	name:"querysql",
					    	width:"100%",
					    	height:200,
					    }]
	    		 },{
	    			    xtype : 'fieldset',
					    title : '汇总SQL数据源',
					    collapsible : false,
					    autoHeight : true,
					    autoWidth : true,
					    colspan:2,
					    items:[{
					    	xtype:"textareafield",
					    	name:"countsql",
					    	width:"100%",
					    	height:200,
					    }]
	    		 },{
	    			 	xtype : 'fieldset',
					    title : '字段属性维护',
					    collapsible : false,
					    //autoHeight : true,
					    autoWidth : true,
					    height:220,
					    colspan:4,
	    		 }]
		    }]
	    }],
	    buttons:[ {
			xtype : "button",
			text : "保存",
			listeners:{
				click:function(){
					//fnLoginSystem();
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
	var grid = Tx.auto.TxGrid.getTxGrid({
		queryname:"description",
		items:[{
			text : "新增数据",
			iconCls : "fa fa-plus-circle ",
			handler:function(){
				addData.show();
			}
		}],
		columns:[{
			header: '', 
			xtype: 'rownumberer',  
			align: 'center', 
			sortable: false 
		},{
			text:"数据源ID",
			dataIndex:"id",
			width:100,
		},
	    {
	        text: '查询数据的SQL数据源',
	        flex: 2,
	        dataIndex: 'querysql'
	    },{
	        text: '对数据源进行汇总的SQL',
	        flex: 2,
	        dataIndex: 'countsql',
	        
	    },
	    {
	        text: '数据源的描述',
	        flex: 1,
	        dataIndex: 'description',
	    },
	    {
	        text: '创建日期',
	        flex: 1,
	        dataIndex: 'createdate',
	        renderer:function(value){
	        	return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
	        }
	    },
	    {
	        text: '最后修改日期',
	        flex: 1,
	        dataIndex: 'updatetime',
	        renderer:function(value){
	        	return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
	        }
	    }],
	    sqlid:"0"
	});
	grid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
		record.data.updatetime = Ext.util.Format.date(new Date(record.data.updatetime),"Y-m-d H:i:s");
		record.data.createdate = Ext.util.Format.date(new Date(record.data.createdate),"Y-m-d H:i:s");
		Ext.getCmp("_usermaintainpage_form").getForm().setValues(record.data);
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
        //子元素平均分配宽度  
           flex:1  
	    },  
		items:[grid]
	});
	

	
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[center]
	});
	return cmp;
}
main();

