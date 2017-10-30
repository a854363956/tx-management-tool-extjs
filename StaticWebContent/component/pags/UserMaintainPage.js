function main(){
	var grid_columns= Tx.auto.TxGrid.getTxGrid({
/*		items:[{
			text : "保存修改",
			iconCls : "fa fa-floppy-o",
			handler:function(){
			}
		}],*/
		queryname:"name",
		columns:[{
			header: '', 
			xtype: 'rownumberer',  
			align: 'center', 
			sortable: false 
		},{
			text:"字段ID",
			width:230,
			dataIndex:"id",
		},
	    {
	        text: '字段名称',
	        flex: 1,
	        dataIndex: 'name',
	        editor:{
	        	xtype:"textfield",
	        }
	    },
	    {
	        text: '字段类型',
	        flex: 2,
	        dataIndex: 'datatype'
	    },
	    {
	        text: '列的宽度',
	        flex: 1,
	        dataIndex: 'width',
	    },
	    {
	        text: '是否只读',
	        flex: 1,
	        dataIndex: 'isready',
	    },{
	        text: '强制显示名称',
	        flex: 2,
	        dataIndex: 'forcedlabel',
	        
	    }],
	    sqlid:"1"
	});
	
/*	grid_columns.store.addListener("write",function(store, operation, eOpts){
		debugger;
	});
	*/
	
	var addData=  Ext.Window.create({
		title : "SQL数据源",
	    closable : false,
	    width : "70%",
	    height : "92%",
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    dockedItems:[{
	    	xtype: "toolbar",
	    	dock:"top",
	    	items:[{
	    		xtype: 'button',
	    		iconCls:"fa fa-hand-pointer-o",
	    		text: '初始化字段信息',
	    		handler:function(){
	    			Tx.MessageBox.question("是否确认重新初始化字段信息,新增字段会添加,以前字段信息不变,如果没有则重新生成,是否继续?",function(){
	    				Tx.AjaxRequest.post({
		    				cmd:"spring:baseSystemBusiness#fnGenerateFieldInformation",
		    				datas:{
		    					sql:Ext.getCmp("_usermaintainpage_form").getForm().getValues().querysql
		    				},
		    				dom:addData,
		    				callback:function(result){
		    					var querySqlResultTableColumns=Ext.JSON.decode(result.datas).querySqlResultTableColumns;
		    					var addDatas = new Array();
		    					for(var i=0;i<querySqlResultTableColumns.length;i++){
		    						var data = querySqlResultTableColumns[i];
		    						addDatas.push({
		    							//id:window.GUID().replace(/-/g, ""),
		    							datatype:data.columnTypeName,
		    							name:data.columnLabel,
		    						});
		    					}
		    					grid_columns.store.add(addDatas);
		    					self.disable();
		    				}
		    			});
	    			});
	    		}
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
	    	},"-"/*,{
	    		xtype:"button",
	    		iconCls:"fa fa-bug",
	    		text:"测试SQL语句"
	    	}*/]
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
	    			    fieldLabel : '单表表名',
	    			 	name:"",
	    		 },{
	    			 	fieldLabel : '创建方法',
	    			 	name:"",
	    		 },{
	    			    fieldLabel : '修改方法',
	    			 	name:"",
	    		 },{
	    			    fieldLabel : '删除方法',
	    			 	name:"",
	    			 	
	    		 },{
	    			 	xtype : 'fieldset',
					    title : '查询SQL数据源',
					    collapsible : false,
					    autoHeight : true,
					    autoWidth : true,
					    colspan:2,
					    items:[{
					    	xtype:"sqltextarea",
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
					    	xtype:"sqltextarea",
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
						layout:{  
					        type:'hbox',  
					        align : 'stretch',  
					        pack  : 'start'  
					    },  
					    defaults:{  
				        //子元素平均分配宽度  
				           flex:1  
					    }, 
					    items:[grid_columns]
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

