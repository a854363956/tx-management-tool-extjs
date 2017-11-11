/**
 * 前端的UI页面可视化开发
 * @returns
 */
(function(){
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[],
		
	});
	var tree = Ext.panel.Panel.create({
		region : 'west',
		minWidth:120,
		split : true,
		hideHeaders : true,
		width : "18%",
		title:"所有控件列表",
		collapsible : true,
		layout: 'accordion', //手风琴布局
	    layoutConfig: {
	        titleCollapse: false,
	        animate: true,
	        activeOnTop: true
	    },
	    items: []
	});
	var top = Ext.toolbar.Toolbar.create({
		region : "north",
		items : [{
			text:"新建页面",
			iconCls:"fa fa-sticky-note-o"
		},{
			text:"打开页面",
			iconCls:"fa fa-folder-open-o",
		},{
			text:"保存页面",
			iconCls:"fa fa-floppy-o",
		},{
			text:"另存为副本",
			iconCls:"fa fa-clipboard"
		},{
			text:"删除所有组件",
			iconCls:"fa fa-trash-o",
		}]
	});
	
	var attr= Ext.Panel.create({
		region : 'east',
		minWidth:120,
		//split : true,
		hideHeaders : true,
		width : "23%",
		minWidth:120,
		items : [{
			xtype:"panel",
			title : "布局节点",
			height:300,
			//layout : "border",
			items : [],
		},{
			xtype:"panel",
			title : "组件属性",
			//layout : "border",
			items : [],
		}],
	});
	
	var layout_control = Ext.tree.TreePanel.create({
		title:"布局控件",
		border : false,// 表框
		autoScroll : true,// 自动滚动条
		split : true,
		animate : true,// 动画效果
		rootVisible : false,// 根节点是否可见
		split : true,
		collapsible : true,
		hideHeaders : true,
		listeners:{
			beforerender:function(self){
				self.getRootNode().appendChild({
					leaf:true,
					text:"面板|panel",
					datas:"panel"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"标签页面板|tabpanel",
					datas:"tabpanel"
				});
			}
		}
	});
	var grid_form = Ext.tree.TreePanel.create({
		title:"表格和表单",
		border : false,// 表框
		autoScroll : true,// 自动滚动条
		split : true,
		animate : true,// 动画效果
		rootVisible : false,// 根节点是否可见
		split : true,
		collapsible : true,
		hideHeaders : true,
		listeners:{
			beforerender:function(self){
				self.getRootNode().appendChild({
					leaf:true,
					text:"表格|grid",
					datas:"grid"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"表单|form",
					datas:"form"
				});
			}
		}
	});
	
	var button_editor = Ext.tree.TreePanel.create({
		title:"按钮和编辑器",
		border : false,// 表框
		autoScroll : true,// 自动滚动条
		split : true,
		animate : true,// 动画效果
		rootVisible : false,// 根节点是否可见
		split : true,
		collapsible : true,
		hideHeaders : true,
		 viewConfig : {  
             plugins : {  
                 ddGroup : 'demo',  
                 ptype : 'treeviewdragdrop',  
                 enableDrop : false  
             }  
         }, 
		listeners:{
			beforerender:function(self){
				self.getRootNode().appendChild({
					leaf:true,
					id:"_v_d_button",
					text:"按钮|button",
					datas:"button",
				});
				self.getRootNode().appendChild({
					leaf:true,
					text:"文本编辑框|textfield",
					datas:"textfield"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"日期编辑框|datefield",
					datas:"datefield"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"日期时间编辑框|datetimefield",
					datas:"datetimefield"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"密码输入框|password",
					datas:"password"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"数字输入框|numberfield",
					datas:"numberfield"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"换行文本编辑器|textarea",
					datas:"textarea"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"XML编辑器|xmltextarea",
					datas:"xmltextarea"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"JavaScript编辑器|jstextarea",
					datas:"jstextarea"
				});
				
				self.getRootNode().appendChild({
					leaf:true,
					text:"SQL编辑器|sqltextarea",
					datas:"sqltextarea"
				});
				
			}
		}
	});
	tree.add(button_editor);
	tree.add(layout_control);
	tree.add(grid_form);
	//----------------------初始化tabpanel
	Tx.AjaxRequest.get({
		url:"component/pags/development/libs/Template.txt",
		dom:null,
		callback:function(result){
			var v_editor = Ext.Panel.create({
				region : 'center',
				layout:{  
					type:'hbox',  
					align : 'stretch',  
					pack  : 'start'  
				},  
				defaults:{  
					flex:1  
				},  
				items:[{
					xtype:"jstextarea",
					value:result
				}]
			});
			var center = Ext.TabPanel.create({
				region : 'center',
				activeTab : 0,
				items : [{
					title : "可视化编辑",
					id : "_Visual_Design",
					layout : "border",
					items : [],
					listeners:{
						afterrender:function(){
							var gridEl=Ext.getCmp('_Visual_Design').body.dom;  
				            var gridDropTarget=Ext.create('Ext.dd.DropTarget',gridEl,{  
				                ddGroup:'demo',  
				                notifyEnter:function(source,e,data){  
				                }  
				            });
						}
					}
				},{
					title : "源码编辑",
					id : "_Source_Editing",
					layout : "border",
					items : [ v_editor ],
				}],
			});
			
			//----------------------
			//添加控件
			//--------------
			cmp.add(top);
			cmp.add(tree);
			cmp.add(attr);
			cmp.add(center);
			//---------------
		}
	});
	
	
	return cmp;
})();