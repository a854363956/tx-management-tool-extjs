/**
 * 菜单资料维护
 * @returns
 */
(function(){
	var grid ;
	 var contextmenu = new Ext.menu.Menu({
	        id:'theContextMenu',
	        items:[{
	            text:'创建子目录',
	            iconCls:"fa fa-plus-square",
	            handler:function(){
	                Ext.Msg.alert("系统提示","测试");
	            }
	        },"-",{
	        	text:'修改序号',
	        	iconCls:"fa fa-pencil-square",
	            handler:function(){
	                Ext.Msg.alert("系统提示","测试");
	            }
	        },"-",{
	        	iconCls:"",
	            text:'创建目录',
	            iconCls:"fa fa-plus-circle ",
	            handler:function(){
	                Ext.Msg.alert("系统提示","测试");
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
	var tree = Ext.panel.Panel.create({
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
						beforecellclick :function( self, td, cellIndex, record, tr, rowIndex, e, eOpts){
							var datas= record.data.datas;
							var proxy = grid.store.getProxy();
							proxy.setExtraParams({
								"conditionName":"father",
								"conditionValue":datas.id,
								"conditionSymbol":"2",
							});
							grid.store.load();
						},
						itemcontextmenu:function(view,record,item,index,e){
					        e.preventDefault();
					        contextmenu.showAt(e.getXY());
					    },
						afteritemexpand :function(node, deep, animal){
							node.removeAll();
							Tx.AjaxRequest.post({
								cmd:"spring:baseSystemBusiness#getTxSysMenu",
								datas:{
									father:node.data.datas.id,
								},
								dom:null,
								callback:function(result){
									var datas = Ext.JSON.decode(result.datas).datas;
									for(var i=0;i<datas.length;i++){
										if(datas[i].leaf == 0? true:false){
											node.appendChild({
												id:"id_"+datas[i].id,
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
								},
								dom:null,
								callback:function(result){
									var datas = Ext.JSON.decode(result.datas).datas;
									for(var i=0;i<datas.length;i++){
										self.getRootNode().appendChild({
											id:"id_"+datas[i].id,
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