(function(){
  var grid_columns= Tx.auto.TxGrid.getTxGrid({
/*	items:[{
			text : "保存修改",
			iconCls : "fa fa-floppy-o",
			handler:function(){
				var selection = grid_columns.getView().getSelectionModel().getSelection()[0];
				grid_columns.store.remove(selection);
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
        flex: .8,
        dataIndex: 'name',
    },{
        text: '字段类型',
        flex: .8,
        dataIndex: 'datatype'
    },{
        text: '列的宽度',
        flex: .8,
        dataIndex: 'width',
        editor:{
        	xtype:"textfield",
        }
    },{
    	text: '编辑器类型',
        flex: .8,
        dataIndex: 'editor',
        editor:{
        	xtype:"textfield",
        }
    },{
        text: '是否只读',
        flex: .8,
        dataIndex: 'isready',
        editor:{
        	xtype:'combo',
			editable:false,
			width:85,
			store:[
				['0','只读'],
				['1','不只读'],
			],
			value:"0",
        },
	    renderer:function(value){
        	return value=="0"? "只读":value=="1"?"正常":"未知属性";
        }
    },{
        text: '强制名称',
        flex: .8,
        dataIndex: 'forcedlabel',
        editor:{
        	xtype:"textfield",
        }
    },{
    	text: '扩展属性',
        flex: 2,
        dataIndex: 'exatt',
        editor:{
        	xtype:"textfield",
        }
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
	    							gridid:Ext.getCmp("_usermaintainpage_form").getForm().getValues().id,
	    							isready:"0"
	    						});
	    					}
	    					grid_columns.store.removeAll();
	    					var store = grid_columns.store;
	    					grid_columns.store.add(addDatas);
	    					grid_columns.store.sync();
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
    			 	name:"singletablename",
    			 	regex : /^[a-zA-Z0-9_]+$/, 
    			 	regexText:"不是有效的路径格式,路径格式为^[a-zA-Z0-9_]+$"
    		 },{
    			    xtype: 'textfield',
    			 	fieldLabel : '创建方法',
    			 	name:"fncreate",
    			 	allowBlank:true,
    			 	regex : /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$/, 
    			 	regexText:"不是有效的路径格式,路径格式为^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$"
    		 },{
    			    xtype: 'textfield',
    			    fieldLabel : '修改方法',
    			 	name:"fnupdate",
    			 	allowBlank:true,
    			 	regex : /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$/, 
    			 	regexText:"不是有效的路径格式,路径格式为^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$"
    		 },{
    			    fieldLabel : '删除方法',
    			 	name:"fndelete",
    			 	allowBlank:true,
    			 	regex : /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$/, 
    			 	regexText:"不是有效的路径格式,路径格式为^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$"
    			 	
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
    		 }]
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
 }],
    buttons:[ {
		xtype : "button",
		text : "保存",
		listeners:{
			click:function(){
				if(Ext.getCmp("_usermaintainpage_form").isValid()){
					var datas = Ext.getCmp("_usermaintainpage_form").getForm().getValues();
					Tx.AjaxRequest.post({
						cmd:"spring:baseSystemBusiness#fnSaveTableModelsConfig",
						datas:{
							datas:datas,
							name:"tx_sys_grid",
						},
						dom:addData,
						callback:function(result){
							Tx.MessageBox.question("数据保存成功,是否刷新数据并隐藏弹出框?",function(){
								grid.store.load();
								addData.hide();
							});
						}
					});
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


var grid = Tx.auto.TxGrid.getTxGrid({
	queryname:"description",
	items:[{
		text : "新增数据",
		iconCls : "fa fa-plus-circle ",
		handler:function(){
			var datas = {};
			var updatetime = Ext.util.Format.date(new Date(),"Y-m-d H:i:s");
			var createdate = Ext.util.Format.date(new Date(),"Y-m-d H:i:s");
			datas.updatetime=updatetime;
			datas.createdate=createdate;
			datas.querysql="";
			datas.countsql ="";
			datas.description="";
			datas.singletablename="";
			datas.fncreate="";
			datas.fnupdate="";
			datas.fndelete="";
			datas.id=GUID();
			Ext.getCmp("_usermaintainpage_form").getForm().setValues(datas);
			var proxy = grid_columns.store.getProxy();
			proxy.setExtraParams({
				"conditionName":"gridid",
				"conditionValue":Ext.getCmp("_usermaintainpage_form").getForm().getValues().id,
				"conditionSymbol":"2",
			});
			grid_columns.store.load();
			addData.show();
		}
	},{
		text : "删除数据",
		iconCls : "fa fa-plus-circle ",
		handler:function(){
			Tx.MessageBox.question("您确定要删除当前选中的数据,删除数据后无法重新恢复数据,是否确认?", function() {
			var selection = grid.getView().getSelectionModel().getSelection()[0];
				grid.store.remove(selection);
		    });
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
        },
       /* editor:new Ext.form.DateField({  
          //在编辑器里面显示的格式,这里为09-10-20的格式  
          format: 'y-m-d'  
        })  */
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
	var proxy = grid_columns.store.getProxy();
	proxy.setExtraParams({
		"conditionName":"gridid",
		"conditionValue":Ext.getCmp("_usermaintainpage_form").getForm().getValues().id,
		"conditionSymbol":"2",
	});
	grid_columns.store.load();
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
cmp._destroy=function(){
	addData.destroy();
}
return cmp;
})();
