(function(){
	
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
	Tx.auto.TxGrid.getColumns({
		sqlid:"905258cfbe6d49d0a240927453b25539",
		callback:function(result){
		
			function fnSaveData(isHide){
				
				if(Ext.getCmp("_personnelInformation_form").isValid()){
					
					var datas = Ext.getCmp("_personnelInformation_form").getForm().getValues();
				
					if(datas.id == null || datas.id ==""){
						
					}
					Tx.AjaxRequest.post({
						cmd:"spring:baseSystemBusiness#fnSaveTableModelsConfig",
						datas:{
							datas:datas,
							name:"tx_base_user",
						},
						dom:addData,
						callback:function(result){
							var hide = isHide || false;
							if(hide==false){
								Tx.MessageBox.info("数据保存成功!");
							}else{
								Tx.MessageBox.question("数据保存成功,是否刷新数据并隐藏弹出框?",function(){
									grid.store.load();
									addData.hide();
								});
							}
						}
					});
				}
			}
			var grid;
			Tx.auto.TxGrid.getGrid({
				sqlid:"d3a699f848d347a581120681028199a1",
				queryname:"role_name",
				callback:function(rolegrid){
					
					var addData=Tx.Window.create({
						title : "人员信息维护,初始化密码123456",
					    closable : false,
					    width : "20%",
					    height : "58%",
					    resizable : false, // 窗口可拖动改变大小;
					    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
					    plain : true, // 使窗体主体更融于框架颜色;
					    items:[{
					    	xtype:"form",
					    	id:"_personnelInformation_form",
					    	layout : "form", // 整个大的表单是form布局
					        labelAlign : "right",
					    	items:[{
						    	/*layout: {
						    	    type: 'table',
						    	    columns: 1
						    	},*/
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
						    			hidden:true
						    	},{
							    		fieldLabel : '${password}',
						    			name:"password",
						    			hidden:true
						    	},{
						    			fieldLabel : '${username}',
						    			name:"username",
					    		 },{
					    			 	fieldLabel : '${actual_name}',
					    			 	name:"actual_name",
					    		 },{
					    			 	fieldLabel : '${email}',
					    			 	name:"email",
					    			 	regex : /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, 
					    			 	regexText:"不是有效的邮箱格式,邮箱格式为^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$",
					    			 	allowBlank : true
					    			 	
					    		 },{
					    			 	fieldLabel : '${id_card}',
					    			 	name:"id_card",
					    			 	regex : /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/, 
					    			 	regexText:"不是有效的身份证格式,身份证格式为/^(\d{18,18}|\d{15,15}|\d{17,17}x)$/",
					    			 	allowBlank : true
					    		 },{
					    			    fieldLabel : '${phone}',
					    			 	name:"phone",
					    			 	//regex : /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8}$/, 
					    			 	//regexText:"不是有效的手机格式,手机格式为^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8}$",
					    			 	allowBlank : true
					    			 	
					    		 },{
					    			 	fieldLabel : '${pagesize}',
					    			 	name:"pagesize",
					    			 	xtype:'combo',
										editable:false,
										store:['10','20','50','100','200','500','1000'],
										value:'50',
					    		 },{
					    			    fieldLabel : '${language}',
					    			 	name:"language",
					    		 },{
					    			    fieldLabel : '${safety}',
					    			 	name:"safety",
					    			 	xtype:'combo',
										editable:false,
										store:[['0','中'],['1','高']],
										value:'0',
					    		 },{
					    			    fieldLabel : '${session_valid}',
					    			 	name:"session_valid",
					    		 },{
					    			    xtype:"datetimefield",
					    			    fieldLabel : '${create_time}',
					    			 	name:"create_time",
					    		 },{
					    			 	xtype:"datetimefield",
					    			    fieldLabel : '${expiration_date}',
					    			 	name:"expiration_date",
					    		 }],
					    		 buttons:[ {
					    				xtype : "button",
					    				text : "保存",
					    				listeners:{
					    					click:function(){
					    						var datas = Ext.getCmp("_personnelInformation_form").getForm().getValues();
					    						if(datas.id == null || datas.id ==""){
					    							var store = grid.store;
					    							grid.store.add(datas);
					    							grid.store.sync();
					    							grid.store.load();
					    							addData.hide();
					    						}else{
					    							Tx.MessageBox.question("是否确认保存,所有更改的数据将在下次登入后生效!!!",function(){
					    								fnSaveData(true);
					    							});
					    						}
					    					}
					    				}
					    		    },{
					    		    	xtype:"button",
					    		    	text:"返回",
					    		    	listeners:{
					    		    		click:function(){
					    		    			Ext.getCmp('_personnelInformation_form').form.reset()
					    		    			addData.hide();
					    		    		}
					    		    	}
					    		    }]
						    }]
					    }]
					});
					
					
					grid= Tx.auto.TxGrid.getTxGrid({
						queryname:"actual_name",
						items:[{
							text:"初始化密码",
							iconCls:"fa fa-recycle",
							handler:function(){
								var data = grid.getView().getSelectionModel().getSelection()[0];
								Tx.AjaxRequest.post({
	    							cmd:"spring:baseSystemBusiness#fnOnInitPassword",
	    							datas:{
	    								userid:data.id,
	    							},
	    							dom:grid,
	    							callback:function(result){
	    								Tx.MessageBox.info("初始化密码成功,新密码为123456,受影响行数["+result.datas+"]行");
	    							}
	    						});
							}
						},{
							text : "变更角色",
							iconCls : "fa fa-share",
							handler:function(){
								roleData.show();
						    }
						},{
							text : "新增人员",
							iconCls : "fa fa-plus-circle",
							handler:function(){
								Ext.getCmp('_personnelInformation_form').form.reset()
								var expiration_date = Ext.Date.add(new Date(), Ext.Date.YEAR, 3);
								Ext.getCmp("_personnelInformation_form").getForm().setValues({
									create_time:Ext.util.Format.date(new Date(),"Y-m-d H:i:s"),
									expiration_date:expiration_date,
									session_valid:1800,
									password:"22c78eece78866c3a5f7b46321403e1a",
									language:"0"
								});
								addData.show();
							}
						},{
							text : "删除人员",
							iconCls : "fa fa-minus-circle",
							handler:function(){
								Tx.MessageBox.question("您确定要删除当前选中的数据,删除数据后无法重新恢复数据,是否确认?", function() {
									var selection = grid.getView().getSelectionModel().getSelection()[0];
										grid.store.remove(selection);
										grid.store.load();
								});
							}
						}],
					 	 columns:result,
					     sqlid:"905258cfbe6d49d0a240927453b25539"
					 });
					grid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
						record.data.create_time = Ext.util.Format.date(new Date(record.data.create_time),"Y-m-d H:i:s");
						record.data.expiration_date = Ext.util.Format.date(new Date(record.data.expiration_date),"Y-m-d H:i:s");
						Ext.getCmp("_personnelInformation_form").getForm().setValues(record.data);
						addData.show();
					});
					var roleData = Tx.Window.create({
						width : "45%",
						height : "58%",
						layout:{  
					        type:'hbox',  
					        align : 'stretch',  
					        pack  : 'start'  
					    },  
					    defaults:{  
				           flex:1  
					    },
						title : "请选择变更的角色",
						items:[rolegrid],
						 buttons:[ {
			    				xtype : "button",
			    				text : "变更",
			    				listeners:{
			    					click:function(){
			    						var selection =  rolegrid.getView().getSelectionModel().getSelection()[0];
			    						var selectionm = grid.getView().getSelectionModel().getSelection()[0];
			    						var datas  = selection.data;
			    						var datasm = selectionm.data;
			    						Tx.AjaxRequest.post({
			    							cmd:"spring:baseSystemBusiness#fnRoleChange",
			    							datas:{
			    								userid:datasm.id,
			    								change_roleid:datas.id,
			    							},
			    							dom:roleData,
			    							callback:function(result){
			    								Tx.MessageBox.info("角色变更成功,受影响行数["+result.datas+"]行",function(){
			    									roleData.hide();
			    								});
			    							}
			    						});
			    					}
			    				}
			    		    },{
			    		    	xtype:"button",
			    		    	text:"返回",
			    		    	listeners:{
			    		    		click:function(){
			    		    			//Ext.getCmp('_personnelInformation_form').form.reset()
			    		    			//addData.hide();
			    		    			roleData.hide();
			    		    		}
			    		    	}
			    		    }]
					});
					center.add(grid);
					cmp._destroy=function(){
						roleData.destroy();
						addData.destroy();
					}
				}
			}); 
		}
	});
	return cmp;
})();