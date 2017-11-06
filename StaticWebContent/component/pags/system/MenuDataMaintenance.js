/**
 * 菜单资料维护
 * @returns
 */
(function(){
	 var grid,current_node,tree;
	 var treechs = new Array();
	 function refresh(){
		 for(var i =0;i<treechs.length;i++){
 			var node = treechs[i];
 			var root = node.getRootNode()
				for(var i =0;i<root.childNodes;i++){
					root.childNodes[i].removeAll();
				}
 			
 			Tx.AjaxRequest.post({
					cmd:"spring:baseSystemBusiness#getTxSysMenu",
					datas:{
						father:data.id,
						permissions:"0",
					},
					dom:null,
					callback:function(result){
						
						var datas = Ext.JSON.decode(result.datas).datas;
						for(var i=0;i<datas.length;i++){
							root.appendChild({
								id:"_id_"+datas[i].id,
								leaf:datas[i].leaf == 0? false:true,
								text:datas[i].label+" |序号:"+datas[i].sorting,
								datas:datas[i]
							});
						}
					}
				});
 		}
	 }
	 var updateData =Tx.Window.create({
			title : "修改菜单信息",
		    closable : false,
		    width : 280,
		    height : 130,
		    resizable : false, // 窗口可拖动改变大小;
		    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
		    plain : true, // 使窗体主体更融于框架颜色;
		    items:[{
		    	xtype:"form",
		    	id:"__menu_data_maintenance_page_update_form",
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
						padding :"0px 0px 0px 4px",
						labelWidth:65,
			    	},
			    	items:[{
			    		fieldLabel : '${id}',
		    			name:"id",
		    			hidden:true,
			    	},{
			    			fieldLabel : '${label}',
			    			name:"label",
		    		 },{
		    			 	fieldLabel : '${sorting}',
		    			 	name:"sorting",
		    		 }]
		    	}]
		    }],
		    buttons:[{
				xtype : "button",
				text : "保存",
				listeners:{
					click:function(){
						/*if(Ext.getCmp("__add_user_maintain_page_form").isValid()){
							var datas = Ext.getCmp("__add_user_maintain_page_form").getForm().getValues()
							var store = grid.store;
							grid.store.add(datas);
							grid.store.sync();
							addData.hide();
						}*/
					}
				}
		    },{
		    	xtype:"button",
		    	text:"返回",
		    	listeners:{
		    		click:function(){
		    			updateData.hide();
		    		}
		    	}
		   }]
		});
	 
	 var addData =Tx.Window.create({
			title : "新增数据",
		    closable : false,
		    width : 280,
		    height : 180,
		    resizable : false, // 窗口可拖动改变大小;
		    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
		    plain : true, // 使窗体主体更融于框架颜色;
		    items:[{
		    	xtype:"form",
		    	id:"__menu_data_maintenance_page_form",
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
						padding :"0px 0px 0px 4px",
						labelWidth:65,
			    	},
			    	items:[{
			    			fieldLabel : '${label}',
			    			name:"label",
		    		 },{
		    			 	fieldLabel : '${sorting}',
		    			 	name:"sorting",
		    		 },{
		    			 	fieldLabel : '${icon_class}',
		    			 	name:"icon_class",
		    		 },{
		    			 	fieldLabel : '${path}',
		    			 	name:"path",
		    		 }]
		    	}]
		    }],
		    buttons:[{
				xtype : "button",
				text : "保存",
				listeners:{
					click:function(){
						/*if(Ext.getCmp("__add_user_maintain_page_form").isValid()){
							var datas = Ext.getCmp("__add_user_maintain_page_form").getForm().getValues()
							var store = grid.store;
							grid.store.add(datas);
							grid.store.sync();
							addData.hide();
						}*/
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
	 var contextmenu = new Ext.menu.Menu({
	        id:'theContextMenu',
	        items:[{
	            text:'创建子目录',
	            iconCls:"fa fa-plus-square",
	            handler:function(){
	            	if(typeof(current_node) == "undefined"){
	            		Tx.MessageBox.error("请选择点击一行后,在进行操作!");
	            		return;
	            	}
	            	Tx.MessageBox.prompt("请输入子目录的文件夹名称",function(txt){
	            		Tx.AjaxRequest.post({
	            			cmd:"spring:baseSystemBusiness#fnCreateMenuNode",
	            			datas:{
	            				father:current_node.id,
	            				name:txt
	            			},
	            			dom:tree,
	            			callback:function(result){
	            				refresh();
	            				Tx.MessageBox.info("保存成功!受影响行数["+result.datas+"]");
	            			}
	            		})
	            	});
	            }
	        },"-",{
	        	text:'修改属性',
	        	iconCls:"fa fa-pencil-square",
	            handler:function(){
	            	
	            	if(typeof(current_node) == "undefined"){
	            		Tx.MessageBox.error("请选择点击一行后,在进行操作!");
	            		return;
	            	}
	            	Ext.getCmp('__menu_data_maintenance_page_update_form').form.reset()
					Ext.getCmp("__menu_data_maintenance_page_update_form").getForm().setValues({
						sorting:current_node.sorting,
						label:current_node.label,
					});
	            	updateData.show();
	            }
	        },"-",{
	            text:'创建目录',
	            iconCls:"fa fa-plus-circle ",
	            handler:function(){
	            	if(typeof(current_node) == "undefined"){
	            		Tx.MessageBox.error("请选择点击一行后,在进行操作!");
	            		return;
	            	}
	            	Tx.MessageBox.prompt("请输入子目录的文件夹名称",function(txt){
	            		Tx.AjaxRequest.post({
	            			cmd:"spring:baseSystemBusiness#fnCreateMenuNode",
	            			datas:{
	            				father:current_node.father,
	            				name:txt
	            			},
	            			dom:tree,
	            			callback:function(result){
	            				refresh();
	            				Tx.MessageBox.info("保存成功!受影响行数["+result.datas+"]");
	            			}
	            		})
	            	});
	            }
	        },'-',{
	        	text:"刷新",
	        	iconCls:"fa fa-refresh ",
	        	handler:function(){
	        		refresh();
	        	}
	        }]
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
		items:[]
	});
	tree = Ext.panel.Panel.create({
		region : 'west',
		minWidth:120,
		split : true,
		hideHeaders : true,
		width : "18%",
		title:"功能菜单",
		collapsible : true,
		layout: 'accordion', //手风琴布局
	    layoutConfig: {
	        titleCollapse: false,
	        animate: true,
	        activeOnTop: true
	    },
	    items: []
	});
	
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[center,tree]
	});
	
	Tx.AjaxRequest.post({
		cmd:"spring:baseSystemBusiness#getTxSysMenu",
		datas:{
			father:"SYSTEM",
		},
		dom:null,
		callback:function(result){
			var datas = Ext.JSON.decode(result.datas).datas;
			for(var i=0;i<datas.length;i++){
				var data = datas[i];
				var label = data.label;
				var treech = Ext.tree.TreePanel.create({
					title:label,
					border : false,// 表框
					autoScroll : true,// 自动滚动条
					split : true,
					animate : true,// 动画效果
					rootVisible : false,// 根节点是否可见
					split : true,
					collapsible : true,
					hideHeaders : true,
					listeners:{
						cellclick :function( self, td, cellIndex, record, tr, rowIndex, e, eOpts){
							
							var datas= record.data.datas;
							var proxy = grid.store.getProxy();
							proxy.setExtraParams({
								"conditionName":"father",
								"conditionValue":datas.id,
								"conditionSymbol":"2",
								"and":[{
									"conditionName":"leaf",
									"conditionValue":"1",
									"conditionSymbol":"2",
								}]
							});
							grid.store.load();
							current_node = datas;
						},
						itemcontextmenu:function(view,record,item,index,e){
					        e.preventDefault();
					        contextmenu.showAt(e.getXY());
					    },
						afteritemexpand :function(node, deep, animal){
							node.removeAll();
							Tx.AjaxRequest.post({
								cmd:"spring:baseSystemBusiness#getTxSysMenu",
								permissions:"0",
								datas:{
									father:node.data.datas.id,
									permissions:"0",
								},
								dom:null,
								callback:function(result){
									var datas = Ext.JSON.decode(result.datas).datas;
									for(var i=0;i<datas.length;i++){
										if(datas[i].leaf == 0? true:false){
											node.appendChild({
												id:"_id_"+datas[i].id,
												leaf:datas[i].leaf == 0? false:true,
												text:datas[i].label+" |序号:"+datas[i].sorting,
												datas:datas[i],
												
											});
										}
									}
								}
							});
						},
						beforerender :function(self,eOpts){
							Tx.AjaxRequest.post({
								cmd:"spring:baseSystemBusiness#getTxSysMenu",
								datas:{
									father:data.id,
									permissions:"0",
								},
								dom:null,
								callback:function(result){
									var datas = Ext.JSON.decode(result.datas).datas;
									for(var i=0;i<datas.length;i++){
										self.getRootNode().appendChild({
											id:"_id_"+datas[i].id,
											leaf:datas[i].leaf == 0? false:true,
											text:datas[i].label+" |序号:"+datas[i].sorting,
											datas:datas[i]
										});
									}
								}
							});
						}
					}
				});
				treechs.push(treech);
				tree.add(treech);
			}
		}
	});
	
	Tx.auto.TxGrid.getGrid({
		sqlid:"473a816b57314dd0931d8e49df37f377",
		items:[{
			text : "新增页面",
			iconCls : "fa fa-plus-circle ",
			handler:function(){
				if(typeof(current_node) == "undefined"){
            		Tx.MessageBox.error("请选择点击一行后,在进行操作!");
            		return;
            	}
				Tx.AjaxRequest.post({
					cmd:"spring:baseSystemBusiness#fnGetMaxMenuSorting",
					datas:{
						father:current_node.id,
					},
					dom:null,
					callback:function(result){
						var max = result.datas;
						Ext.getCmp('__menu_data_maintenance_page_form').form.reset()
						Ext.getCmp("__menu_data_maintenance_page_form").getForm().setValues({
							sorting:max,
							icon_class:"default",
							path:"0",
						});
						addData.show();
					}
				});
				
			}
		}],
		queryname:"label",
		callback:function(_grid){
			grid=_grid;
			center.add(grid);
			var proxy = grid.store.getProxy();
			proxy.setExtraParams({
				"conditionName":"id",
				"conditionValue":"NULL",
				"conditionSymbol":"2",
			});
			grid.store.load();
		}
	});
	return cmp;
})();