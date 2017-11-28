/**
 * 前端的UI页面可视化开发
 * @returns
 */
(function(){
	var vs_current_data,grid;
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
			handler:function(){
				Ext.getCmp("_Visual_Design_Preview").removeAll();
				Ext.getCmp("_treepanel").getRootNode().removeAll();
				grid.store.removeAll();
			}
			
		}]
	});
	var store = Ext.data.Store.create({
		data:[]
	});
	grid = Ext.grid.Panel.create({
		 store:store,
		 dockedItems: [{
			    dock : 'bottom',
			    xtype :'toolbar',
			    items:[{
			    	text:"添加属性",
			    	iconCls:"fa fa-plus-circle",
			    },"-",{
			    	text:"移除属性",
			    	iconCls:"fa fa-minus-circle"
			    }]
		 }],
		 plugins:['bufferedrenderer',{
				ptype: 'cellediting',
		        clicksToEdit: 1,
		        listeners:{
		        	afteredit:function( self, newData, eOpts){
		        		var selection =grid.getView().getSelectionModel().getSelection()[0];
		        		var name = selection.data.aname;
		        		var value= selection.data.avalue;
		        		var datasAll  =grid.store.data.items;
		        		if(typeof(selection) != "undefined"){
		        			var id;
		        			for(var i=0;i<datasAll.length;i++){
		        				if(datasAll[i].data.aname=="id"){
		        					id=datasAll[i].data.avalue;
		        					break;
		        				}
		        			}
		        			var v_ = Number.parseInt(value);
		        			if(window.isNaN(v_)){
		        				Ext.getCmp(id)["set"+ Ext.util.Format.capitalize(name)](value);
		        			}else{
		        				Ext.getCmp(id)["set"+ Ext.util.Format.capitalize(name)](v_);
		        			}
		        		}
			        }
		        }
		 }],
		 columns: [
		        {
		            text: '属性名称',
		            dataIndex: 'aname',
		            width:"49%"
		        },
		        {
		            text: '属性值',
		            dataIndex: 'avalue',
		            editor:{
		            	xtype:"textfield",
		            },
		            width:"49%"
		        }
		    ]
	});
	var gridpanel = Ext.Panel.create({
		region : 'center',
		width : "100%",
		height:250,
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
	var attr= Ext.Panel.create({
		region : 'east',
		minWidth:120,
		//split : true,
		//height:"100%",
		hideHeaders : true,
		width : "23%",
		minWidth:120,
		items : [{
			xtype:"treepanel",
			id:"_treepanel",
			title : "布局节点",
			height:300,
			border : false,// 表框
			autoScroll : true,// 自动滚动条
			split : true,
			animate : true,// 动画效果
			rootVisible : false,// 根节点是否可见
			split : true,
			collapsible : true,
			hideHeaders : true,
			//layout : "border",
			items : [],
			listeners:{
				beforecellclick :function(self, td, cellIndex, record, tr, rowIndex, e, eOpts ){
					store.removeAll();
					var datas = record.data.datas;
					store.add(datas);
				}
			}
		},gridpanel],
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
		viewConfig : {  
            plugins : {  
                ddGroup : '_v_s',  
                ptype : 'treeviewdragdrop',  
                enableDrop : false  
            }  
       }, 
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
		viewConfig : {  
            plugins : {  
                ddGroup : '_v_s',  
                ptype : 'treeviewdragdrop',  
                enableDrop : false  
            }  
       }, 
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
                 ddGroup : '_v_s',  
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
					items : [{
						xtype:"panel",
						region : 'center',
						id:"_Visual_Design_Preview",
						items:[],
						listeners:{
							afterrender:function(){
								var gridEl=Ext.getCmp('_Visual_Design').body.dom;  
					            var gridDropTarget=Ext.create('Ext.dd.DropTarget',gridEl,{  
					                ddGroup:'_v_s',  
					                notifyEnter:function(source,e,data){  
					                	vs_current_data = data.records[0].data.datas;
					                }, 
					            });
							},
						}
					}],
					listeners:{
						el:{
							mouseup:function(self){
								var selection = Ext.getCmp("_treepanel").getView().getSelectionModel().getSelection()[0];
								if(typeof(selection)=="undefined"){
									//------------添加grid--------------------
									if(typeof(vs_current_data)!="undefined"){
										if(vs_current_data == "grid"){
											Tx.MessageBox.prompt("请输入表格的id",function(txt){
												var config ={
														sqlid:txt,
														id:"vs"+window.GUID(),
														height:300
												}
												Tx.auto.TxGrid.getGrid({
													sqlid:config.sqlid,
													id:config.id,
													height:config.height,
													callback:function(grid){
														Ext.getCmp("_Visual_Design_Preview").add(grid);
														Tx.AjaxRequest.post({
															cmd:"spring:baseSystemBusiness#fnGetComponentInfo",      
															datas:{
																cname:vs_current_data
															},
															callback :function(datas){
																var attrs = Ext.JSON.decode(datas.datas);
																for(var i=0;i<attrs.length;i++){
																	if(attrs[i].aname == "sqlid"){
																		attrs[i].avalue=config.sqlid
																	}else if(attrs[i].aname == "id"){
																		attrs[i].avalue=config.id
																	}
																}
																Ext.getCmp("_treepanel").getRootNode().appendChild({
																	leaf:false,
																	iconCls:"fa fa-tablet",
																	id:"tree"+config.id,
																	text:vs_current_data,
																	datas:attrs
																});
																//store.add(attrs); //添加数据
																Ext.getCmp("_treepanel").getSelectionModel().select(Ext.getCmp("_treepanel").store.find("id","tree"+config.id), true);
																var tree = Ext.getCmp("_treepanel").getView().getSelectionModel().getSelection()[0];
																vs_current_data=undefined;
															}
														});
													}
												});
											});
										}
									}
									//-----------------------------添加gird end
								}else{
									var node = selection.data;
									var datas= node.datas;
									var cmpid;
									for(var i=0;i<datas.length;i++){
										if(datas[i].aname=="id"){
											cmpid=datas[i].avalue;
											break;
										}
									}
									if(vs_current_data == "button"){
										var top = Ext.getCmp(cmpid).getDockedItems("toolbar[dock=\"top\"]")[0];
										
										Tx.AjaxRequest.post({
											cmd:"spring:baseSystemBusiness#fnGetComponentInfo",      
											datas:{
												cname:vs_current_data
											},
											callback :function(datas){
												var attrs = Ext.JSON.decode(datas.datas);
												var config = {};
												config.id="vs"+window.GUID();
												for(var i=0;i<attrs.length;i++){
													var value = attrs[i].avalue || null ;
													if(attrs[i].aname == "id"){
														attrs[i].avalue = config.id;
													}
													if(value!= null ){
														config[attrs[i].aname] = attrs[i].avalue;
													}
												}
												top.add(config);
												selection.appendChild({
													leaf:false,
													iconCls:"fa fa-tablet",
													id:"tree"+config.id,
													text:vs_current_data,
													datas:attrs
												});
												selection.expand();
												vs_current_data=undefined;
											}
										});
										
									}
								}
								
							}	
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