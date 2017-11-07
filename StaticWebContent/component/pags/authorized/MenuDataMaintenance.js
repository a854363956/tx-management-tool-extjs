/**
 * 授权菜单资料维护
 * @returns
 */
(function(){
	 var grid,current_node,tree,rolegrid;
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
	
	var bottom =  Ext.Panel.create({
		region : 'south',
		height : "70%",
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
	var _cen = Ext.Panel.create({
		region : 'center',
		layout : "border",  
		items:[center,bottom]
	});
	tree = Ext.panel.Panel.create({
		header :false,
		region : 'west',
		minWidth:120,
		//split : true,
		//hideHeaders : true,
		width : "18%",
		//collapsible : true,
	    items: []
	});
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[tree,_cen]
	});

	var treech = Ext.tree.TreePanel.create({
		title:"系统菜单授权管理",
		border : false,// 表框
		autoScroll : true,// 自动滚动条
		split : true,
		animate : true,// 动画效果
		rootVisible : false,// 根节点是否可见
		split : true,
		//collapsible : true,
		hideHeaders : true,
		listeners:{
			cellclick :function( self, td, cellIndex, record, tr, rowIndex, e, eOpts){
				var selection = rolegrid.getView().getSelectionModel().getSelection()[0];
				if(typeof(selection) == "undefined"){
					Tx.MessageBox.error("请选择点击角色后,在进行操作!");
					return;
				}
				var data_ = selection.data;
				var datas= record.data.datas;
				var proxy = grid.store.getProxy();
				proxy.setExtraParams({
					"conditionName":"father",
					"conditionValue":datas.id,
					"conditionSymbol":"2",
					"and":[/*{
						"conditionName":"leaf",
						"conditionValue":"1",
						"conditionSymbol":"2",
					},*/{
						"conditionName":"roleid",
						"conditionValue":data_.id,
						"conditionSymbol":"2",
					}]
				});
				grid.store.load();
				current_node = datas;
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
						father:"SYSTEM",
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
/*	Tx.AjaxRequest.post({
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
			
				tree.add(treech);
			}
		}
	});*/
	function fnAuthorizeMmenu(father,id,bo){
		Tx.AjaxRequest.post({
			cmd:"spring:baseSystemBusiness#fnAuthorizeMmenu",
			datas:{
				id:id,
				state:bo==true?"0":"1",
				father:father
			},
			dom:grid,
			callback:function(result){
				Tx.MessageBox.info("授权操作成功!");
				grid.store.load();
			}
		});
	}
	Tx.auto.TxGrid.getGrid({
		sqlid:"8c974f1ece1241e5b556d50ffea10d33",
		items:[{
			text : "取消授权",
			iconCls : "fa fa-minus-circle",
			handler:function(){
				var selection = grid.getView().getSelectionModel().getSelection()[0];
				if(typeof(selection) == "undefined"){
            		Tx.MessageBox.error("请选择点击角色菜单,在进行操作!");
            		return;
            	}
				fnAuthorizeMmenu(selection.data.autid,false);
				
			}
		},"-",{
			text:"授权菜单",
			iconCls : "fa fa-plus-circle ",
			handler:function(){
				var selection = grid.getView().getSelectionModel().getSelection()[0];
				if(typeof(selection) == "undefined"){
            		Tx.MessageBox.error("请选择点击角色菜单,在进行操作!");
            		return;
            	}
				fnAuthorizeMmenu(selection.data.father,selection.data.autid,true);
				
			}
		}],
		queryname:"label",
		callback:function(_grid){
			grid=_grid;
			bottom.add(grid);
			var proxy = grid.store.getProxy();
			proxy.setExtraParams({
				"conditionName":"id",
				"conditionValue":"NULL",
				"conditionSymbol":"2",
			});
			grid.store.load();
			
			Tx.auto.TxGrid.getGrid({
				sqlid:"d3a699f848d347a581120681028199a1",
				queryname:"role_name",
				callback:function(rolegrid_){
					rolegrid=rolegrid_;
					center.add(rolegrid);
				}
			});
		}
	});
	return cmp;
})();