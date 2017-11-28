var VERSION = "000.000.004";
Ext.application({
		requires : [ 'Ext.ux.DateTimeField','Ext.ux.TabCloseMenu' ],
		launch : function() {
			Ext.onReady(function () {
				///阻止浏览器默认右键菜单 userid
				//document.oncontextmenu = function () { return false }
				var tabscript ={};
				var isInitTreeMenu=false;
				var updatePassword = Tx.Window.create({
				    title : "请输入原始密码进行修改密码!",
				    closable : false,
				    width : 350,
				    height : 175,
				    resizable : false, // 窗口可拖动改变大小;
				    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
				    plain : true, // 使窗体主体更融于框架颜色;
				    listeners : {
						show : function() {
						    Ext.getCmp('username').focus(true);
						}
				    },
				    buttons : [ {
						xtype : "button",
						text : "修改",
						listeners:{
							click:function(){
								if(Ext.getCmp("updatePasswordFrom").isValid()){
									var da_ = Ext.getCmp("updatePasswordFrom").getForm().getValues();
									Tx.AjaxRequest.post({
										cmd:"spring:baseSystemBusiness#fnUpdatePassword",
										datas:da_,
										dom:null,
										callback:function(result){
											updatePassword.hide();
											Tx.MessageBox.info("修改密码成功!");
										}
									});
								}
							}
						}
				    } ,{
						xtype : "button",
						text : "返回",
						listeners:{
							click:function(){
								updatePassword.hide();
							}
						}
				    }],
					    items : [ {
						xtype : "form",
						id : "updatePasswordFrom",
						defaultType : 'textfield',
						items : [ {
							    xtype : 'fieldset',
							    title : '修改密码',
							    collapsible : false,
							    autoHeight : true,
							    autoWidth : true,
							    defaults : {
									allowBlank : false,
									xtype : 'textfield'
							    },
							    items : [ {
									fieldLabel : '当前密码',
									inputType : 'password',
									name : "password",
									maxLength: 15,
							    }, {
									fieldLabel : '新的密码',
									inputType : 'password',
									maxLength: 15,
									name : "newPassword",
							    }, {
									fieldLabel : '再次输入密码',
									inputType : 'password',
									maxLength: 15,
									name : "twoNewPassword",
							    }]
							} ]
					    } ]
				});
				var top = Ext.toolbar.Toolbar.create({
					region : "north",
					items : [ "->"/*, Ext.button.Button.create({
					    iconCls : "fa fa-refresh fa-lg",
					    text:"清理缓存"
					}), "-", Ext.button.Button.create({
					    iconCls : "fa fa-language",
					    text : "选择业务方言"
					}), "-"*/, Ext.button.Button.create({
					    iconCls : "fa fa-user-circle fa-lg",
					    text : "修改密码",
					    handler:function(){
					    	Ext.getCmp('updatePasswordFrom').form.reset()
					    	updatePassword.show();
					    }
					}), "-", Ext.button.Button.create({
					    iconCls : "fa fa-sign-out fa-lg",
					    text : "退出系统",
					    handler:function(){
					    	Tx.MessageBox.question("是否确认退出当前系统?",function(){
					    		//获取语言的映射关系
								Tx.AjaxRequest.post({
									cmd:"spring:baseSystemBusiness#fnOutLogin",
									dom:null,
									callback:function(result){
										window.location.href = window.location.href;
									}
								});
					    	});
					    }
					}) ]
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
				var bottom =  Ext.toolbar.Toolbar.create({
			        region : 'south',
			        id:"_bottom",
			        items : [Ext.form.Label.create({
			        	id:"__username",
			        	text:"登入帐号: ...... "
			        }),'-',Ext.form.Label.create({
			        	id:"__actual_name",
			        	text:"用户名称: ...... "
			        }), '-', Ext.form.Label.create({
			        	id:"__rolename",
			        	text:"所属角色: ...... "
			        }),'-','->',Ext.form.Label.create({
			        	text:"当前系统版本:"+VERSION
			        })]
			    });
				window._center = Ext.TabPanel.create({
			        region : 'center',
			        id:"_center",
			        //activeTab : 0,
			        items : [],
			        //plugins: Ext.ux.TabCloseMenu.create(),
			        listeners:{
			        }
			    });
				window.view = Ext.Viewport.create({
					id : "view",
					layout : "border",
					items : [ top, tree,bottom,_center]
			    });
				
				//帐号不超过12位,密码不超过15位		
				function onInitTreeMenu(){
					if(isInitTreeMenu == true){
						return;
					}else{
						Tx.AjaxRequest.post({
							cmd:"spring:baseSystemBusiness#getTxSysMenu",
							datas:{
								father:"SYSTEM",
							},
							dom:tree,
							callback:function(result){
								/*if(!Ext.isChrome62){
									Tx.MessageBox.question("系统检测您使用的浏览器不是Google Chrome版本62以上,为了提高系统的流畅性,以及稳定性和安全性,强烈建议使用(PS:Google Chrome版本62以上浏览器将完全保证系统的流畅,稳定和安全),是否确认下载?",function(){
										window.open(window.location.href+"/install/ChromeSetup.exe"); 
									});
								}*/
								//获取语言的映射关系
								Tx.AjaxRequest.post({
									cmd:"spring:baseSystemBusiness#fnGetLanguageAll",
									dom:null,
									callback:function(result){
										window.$$LANGUAGE = Ext.JSON.decode(result.datas);
									}
								});
								//获取用户的基本信息
								Tx.AjaxRequest.post({
									cmd:"spring:baseSystemBusiness#fnGetUserAndGroupInfo",
									dom:null,
									callback:function(result){
										var datas = Ext.JSON.decode(result.datas);
										window.$$USERINFO = datas.USERINFO;
										window.$$USERROLEINFO = datas.USERROLEINFO;
										Ext.getCmp("__username").setText("登入帐号: "+$$USERINFO.username);
										Ext.getCmp("__actual_name").setText("用户名称: "+$$USERINFO.actual_name);
										Ext.getCmp("__rolename").setText("所属角色: "+$$USERROLEINFO.role_name);
									}
								});
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
											beforecelldblclick :function( self, td, cellIndex, record, tr, rowIndex, e, eOpts){
												if(record.data.datas.leaf !=0){
													var path = record.data.datas.path;
													Tx.AjaxRequest.getPageCode(path,function(txt){
														if (_center.queryById(record.id) != null) {
															var cmp = _center.queryById(record.id);
															cmp.show();
														 }else{
															 var cmp;
															try{
																for(var i=0;i<$$LANGUAGE.length;i++){
																	var language = $$LANGUAGE[i];
																	if(language.languagecode == $$USERINFO.language){
																		txt=txt.replaceAll("\\$\\{"+language.name+"\\}",language.label);
																	}
																}
																var	cmp = eval(txt);
																if(!Ext.isObject(cmp)){
																	Tx.MessageBox.error("页面代码编辑错误,返回的不是一个有效的组件对象!");
																	return;
																}
															}catch(e){
																console.error(e);
																Tx.MessageBox.error("页面代码编辑错误,错误信息:"+e.message);
																return;
															}
														 	tabscript[record.id]=cmp;
															 _center.add({
																title : record.get("text"),
																id : record.id,
																closable : true,
																layout : "border",
																items : [ cmp ],
																listeners:{
																	close :function( panel, eOpts ){
																		var _destroy = cmp._destroy || function(){};
																		_destroy();
														        	}
																}
														     }).show();
														 }
														
													});
												}
												
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
															var config = {
																	id:"id_"+datas[i].id,
																	leaf:datas[i].leaf == 0? false:true,
																	text:datas[i].label,
																	datas:datas[i]
																};
															if(config.leaf == true){
																if(datas[i].icon_class !="default"){
																	config.iconCls=datas[i].icon_class;
																}
															}
															node.appendChild(config);
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
														isInitTreeMenu=true;
														var datas = Ext.JSON.decode(result.datas).datas;
														for(var i=0;i<datas.length;i++){
															self.getRootNode().appendChild({
																id:"id_"+datas[i].id,
																leaf:datas[i].leaf == 0? false:true,
																text:datas[i].label,
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
					}
					
				}
				var fnLoginSystem=function(){
					if(Ext.getCmp("loginForm").isValid()){
						Tx.AjaxRequest.fnLoginSystem({
							username:Ext.getCmp("loginForm").getForm().getValues().username,
							password:Ext.getCmp("loginForm").getForm().getValues().password,
							dom:window.loginWindow,
							callback:function(result){
								if(result.state == "SUCCESS"){
									window.loginWindow.hide();
									onInitTreeMenu();
								}else{
									Tx.MessageBox.error(result.msg);
								}
							}
						});
					}
				}
				
				//初始化菜单界面
				onInitTreeMenu();
				
				
				
				window.loginWindow = Tx.Window.create({
				    title : "请输入帐号密码登入!",
				    closable : false,
				    width : 350,
				    height : 145,
				    resizable : false, // 窗口可拖动改变大小;
				    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
				    plain : true, // 使窗体主体更融于框架颜色;
				    listeners : {
						show : function() {
						    Ext.getCmp('username').focus(true);
						}
				    },
				    buttons : [ {
						xtype : "button",
						text : "登入系统",
						listeners:{
							click:function(){
								fnLoginSystem();
							}
						}
				    } ],
					    items : [ {
						xtype : "form",
						id : "loginForm",
						defaultType : 'textfield',
						items : [ {
							    xtype : 'fieldset',
							    title : '帐号密码',
							    collapsible : false,
							    autoHeight : true,
							    autoWidth : true,
							    defaults : {
									allowBlank : false,
									xtype : 'textfield'
							    },
							    items : [ {
									fieldLabel : '帐号名称',
									name : "username",
									id : "username",
									emptyText : '请输入用户名称',
									blankText : '请输入用户名称',
									maxLength: 12,
							    }, {
									fieldLabel : '帐号密码',
									inputType : 'password',
									maxLength: 15,
									enableKeyEvents : true,
									listeners : {
									    keyup : function(self, e) {
											if (e.getKey() === Ext.event.Event.ENTER) {
												fnLoginSystem();
											}
									    }
									},
									name : "password",
									blankText : '请输入用户密码'
							    }]
							} ]
					    } ]
				});
			});
		}
	});