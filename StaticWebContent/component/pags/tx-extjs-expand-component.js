(function(){
	"use strict";
	window.String.prototype.replaceAll  = function(s1,s2){     
	    return this.replace(new RegExp(s1,"gm"),s2);     
	}   
	window.GUID = function() {
		  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		  });
	}
	Ext.define("Tx.MessageBox",{
		//定义静态方法子类不能继承
		statics:{
			toast:function(message){
	            Ext.toast({
	                html: message,
	                closable: false,
	                align: 't',
	                slideInDuration: 400,
	                minWidth: 400
	            });
			},
		 	error:function(message,onclick){
                Ext.MessageBox.show({
                    title: '系统消息',
                    msg: message,
                    buttons: Ext.MessageBox.OK,
                    fn:onclick||function(){},
                    icon: Ext.MessageBox.ERROR
                });
            },
            info:function(message,onclick){
                Ext.MessageBox.show({
                    title: '系统消息',
                    msg: message,
                    buttons: Ext.MessageBox.OK,
                    fn:onclick||function(){},
                    icon: Ext.MessageBox.INFO
                });
            },
            warning:function(message,onclick){
                Ext.MessageBox.show({
                    title: '系统消息',
                    msg: message,
                    buttons: Ext.MessageBox.OK,
                    fn:onclick||function(){},
                    icon: Ext.MessageBox.WARNING
                });
            },
            prompt:function(message,onclick){
            	Ext.MessageBox.prompt("系统消息",message,function(state,txt){
            		if(state == "ok"){
            			onclick(txt);
            		}
            	});
            },
            question:function(message,onclick){
                Ext.MessageBox.show({
                    title: '系统消息',
                    msg: message,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn:function(txt){
                    	var click = onclick||function(){};
                    	if(txt == "ok"){
                    		click();
                    	}
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            },
		}
	});
	Ext.define("Tx.Window",{
		extend:"Ext.Window",
		closeAction:"method-hide",
		closable : false,
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
		onEsc:function(){
			return;
		}
	});

	Ext.define("Tx.data.proxy.Ajax",{
		 alias: 'proxy.ajaxtx',
		 extend:"Ext.data.proxy.Ajax",
		 createRequestCallback: function(request, operation) {
			 var sqlid = this.sqlid;
			 var confg = request.getConfig();
			 var params = Ext.JSON.encode(confg.params);
			 var method = this.method || "POST";
			 confg.method = method;
			 if(confg.action == "read"){
				 confg.params={
						 	cmd:"spring:baseSystemBusiness#fnStandardPagingQuery",
				        	datas:$fnDesEncryption(Ext.JSON.encode({
				        		pagingParams:params,
				        		sqlid:sqlid
				        	})),
				        	request_date:""+new Date().getTime()
				 }
			 }else{
				 confg.params={
						 	cmd:"spring:baseSystemBusiness#fnStandardPagingSave",
				        	datas:$fnDesEncryption(Ext.JSON.encode({
				        		pagingParams:params,
				        		sqlid:sqlid,
				        		action:confg.action,
				        		jsonData:confg.jsonData
				        	})),
				        	request_date:""+new Date().getTime()
				 }
			 }
			request.setConfig(confg);
	        return function(options, success, response) {
	        	if(success == false ){
	        			Tx.MessageBox.error("调用服务失败!错误码"+response.status);
	        		return ;
	        	}else{
		        		var result = Ext.JSON.decode(response.responseText);
		        		if(result.state=="RELOGIN"){
	        			var datas={
	        					datas:[],
	        					count:0
	        			}
	        			response.responseText = Ext.JSON.encode(datas);
	        			var me = this;
	        			if (request === me.lastRequest) {
	        				me.lastRequest = null;
	        			}
	        			
	        			if (!me.destroying && !me.destroyed) {
	        				me.processResponse(success, operation, request, response);
	        			}
	        			window.loginWindow.show();
	        			return;
	        		}else if(result.state=="ERROR"){
	        			Tx.MessageBox.error(result.msg);
	        			var datas={
	        					datas:[],
	        					count:0
	        			}
	        			response.responseText = Ext.JSON.encode(datas);
	        			var me = this;
	        			if (request === me.lastRequest) {
	        				me.lastRequest = null;
	        			}
	        			
	        			if (!me.destroying && !me.destroyed) {
	        				me.processResponse(success, operation, request, response);
	        			}
	        			return;
	        		}else if(result.state=="SUCCESS"){
	        			var datatx ;
	        			if(result.safety){
	        				datatx = $fnDesDecrypt(result.datas);
			        	}else{
			        		datatx = result.datas;
			        	}
	        			response.responseText=datatx;
	        			var me = this;
	        			if (request === me.lastRequest) {
	        				me.lastRequest = null;
	        			}
	        			
	        			if (!me.destroying && !me.destroyed) {
	        				me.processResponse(success, operation, request, response);
	        			}
	        		}
	        	}
	        };
	    },
	});

	var key_0 ;
	var key_1 ;
	var key_2 ;
	//DES加密数据
	window.$fnDesEncryption = function(txt){
		try {
			if(txt == null || typeof(txt) == "undefined"){
				return "";
			}else{
				return Ext.util.Base64.encode($des_encrypt(txt,Ext.util.Cookies.get("key_0"),Ext.util.Cookies.get("key_1"),Ext.util.Cookies.get("key_2")));
			}
		} catch (e) {
		}
		
	}
	
	//DES解密数据
	window.$fnDesDecrypt = function(txt){
		try {
			if(txt == null || typeof(txt) == "undefined"){
				return "";
			}else{
				return Ext.util.Base64.decode($des_decrypt(txt,Ext.util.Cookies.get("key_0"),Ext.util.Cookies.get("key_1"),Ext.util.Cookies.get("key_2")));
			}
		} catch (e) {
		}
	}
	var _____addData =Tx.Window.create({
		title : "打印方案在线预览",
	    closable : false,
	    width : "55%",
	    height : "80%",
	    resizable : false, // 窗口可拖动改变大小;
	    modal : true, // 设置弹窗之后屏蔽掉页面上所有的其他组件;
	    plain : true, // 使窗体主体更融于框架颜色;
	    html:"<iframe id='__print_views' style='width: 100%;height: 100%'  frameborder=0 name='fnPrintPreview' style='display:none'></iframe>",
	    buttons:[{
			xtype : "button",
			text : "打印",
			listeners:{
				click:function(){
					$("#__print_views")[0].contentWindow.print(); 
				}
			}
	    },"-",{
	    	xtype:"button",
	    	text:"返回",
	    	listeners:{
	    		click:function(){
	    			_____addData.hide();
	    		}
	    	}
	   }],
	   listeners:{
		   show :function(){
			    window._print_loadMarsk = new Ext.LoadMask(_____addData,{
				   msg : '正在获取打印方案,请稍后......',
				   removeMask : true// 完成后移除
				});
				window._print_loadMarsk.show();
		   }
	   }
	});
	Ext.define("Tx.Print",{
		statics:{
			/**
			 * 直接打印文件
			 * @parame  printid 打印模版的ID
			 * @parames parames 打印的参数
			 */
			fnPrintDirectly:function(obj){
				var datas =$fnDesEncryption(Ext.JSON.encode({
					printid:obj.printid,
					datas:obj.datas
				}))
				if($("#_print_page_7337ed01_0618_4966_b592_9a54bd93aad1").length == 0){
					var dom =  "<form id='_print_page_7337ed01_0618_4966_b592_9a54bd93aad1' action='ExtAjaxOfJsService/Request/POST' method='post' target='fnPrintPreview_' style='display:none'></form>"+
							   "<iframe name='fnPrintPreview_' style='display:none'></iframe>";
					$(document.body).append(dom);
				}
				$("#_print_page_7337ed01_0618_4966_b592_9a54bd93aad1").attr("action", "ExtAjaxOfJsService/Request/POST?type=2&request_date="+new Date().getTime()+"&cmd=spring%3AbaseSystemBusiness%23fnCreateDirectPrintPage&datas="+datas);
				$("#_print_page_7337ed01_0618_4966_b592_9a54bd93aad1").submit();
			},
			/**
			 * 预览打印文件
			 * @parame  printid 打印模版的ID
			 * @parame  parames 打印的参数
			 * @parame  dom     要遮挡的dom
			 */
			fnPrintPreview:function(obj){
				_____addData.show();
				var datas =$fnDesEncryption(Ext.JSON.encode({
					printid:obj.printid,
					datas:obj.datas
				}))
				if($("#_print_page_commit_7337ed01_0618_4966_b592_9a54bd93aad1_fnPrintPreview").length == 0){
					var dom =  "<form id='_print_page_commit_7337ed01_0618_4966_b592_9a54bd93aad1_fnPrintPreview' action='ExtAjaxOfJsService/Request/POST' method='post' target='fnPrintPreview' style='display:none'></form>";
					$(document.body).append(dom);
				}
				$("#_print_page_commit_7337ed01_0618_4966_b592_9a54bd93aad1_fnPrintPreview").attr("action", "ExtAjaxOfJsService/Request/POST?type=2&request_date="+new Date().getTime()+"&cmd=spring%3AbaseSystemBusiness%23fnCreatePrintPage&datas="+datas);
				$("#_print_page_commit_7337ed01_0618_4966_b592_9a54bd93aad1_fnPrintPreview").submit();
			}
		}
	});
	Ext.define("Tx.AjaxRequest",{
		statics:{
			fnDownloadFile:function(sqlid){
				
				if($("#_download_object_file_cfc4e88780ee4ec68cfb9fdc839211c0").length == 0){
					var dom = ""+
						"<form id='_download_object_file_cfc4e88780ee4ec68cfb9fdc839211c0' action='ExtAjaxOfJsService/Request/POST' method='post' target='targetIfr' style='display:none'></form>"+   
						"<iframe name='targetIfr' style='display:none'></iframe> ";
					$(document.body).append(dom);
				}
				var datas =$fnDesEncryption(Ext.JSON.encode({
					sqlid:sqlid
				}))
				$("#_download_object_file_cfc4e88780ee4ec68cfb9fdc839211c0").attr("action", "ExtAjaxOfJsService/Request/POST?type=1&request_date="+new Date().getTime()+"&cmd=spring%3AbaseSystemBusiness%23fnDownloadFile&datas="+datas);
				$("#_download_object_file_cfc4e88780ee4ec68cfb9fdc839211c0").submit();
			},
			/**
			 *  用户登入的接口
			 *	username    帐号
			 *  password    密码
			 *  dom         要遮挡的dom
			 *  callback   	登入后的回调函数
			 */
			fnLoginSystem:function(obj){
				var loadMarsk = new Ext.LoadMask(obj.dom,{
				   msg : '正在执行，请稍候......',
				   removeMask : true// 完成后移除
				});
				loadMarsk.show();
				
				function randomPassword(){
					return GUID().replace(/-/g, "").substring(0,4);
				}
				Tx.AjaxRequest.getPublicKey(function(encrypt){
					key_0 = randomPassword();
					key_1 = randomPassword();
					key_2 = randomPassword();
					Ext.util.Cookies.set("key_0",key_0);
					Ext.util.Cookies.set("key_1",key_1);
					Ext.util.Cookies.set("key_2",key_2);
					var json = Ext.JSON.encode({
		        		username:obj.username,
		        		password:obj.password,
		        		key_0:Ext.util.Cookies.get("key_0"),
		        		key_1:Ext.util.Cookies.get("key_1"),
		        		key_2:Ext.util.Cookies.get("key_2")
		        	});
					var datas =encrypt.encrypt(json);
					Ext.Ajax.request({
				        url: 'ExtAjaxOfJsService/Request/POST',
				        params: {
				        	cmd:"spring:baseSystemBusiness#fnLoginSystem",
				        	datas:datas,
				        	request_date:""+new Date().getTime()
				        },
				        method: 'POST',
				        success: function (response, options) {
				        	obj.callback(Ext.JSON.decode(response.responseText));
				        	loadMarsk.hide();
				        },
				        failure: function (response, options) {
				        	Tx.MessageBox.error('请求超时或网络故障,错误编号：' + response.status);
				            loadMarsk.hide();
				        }
				    });
				});
			},
			getPublicKey:function(callback){
				Ext.Ajax.request({
			        url: 'ExtAjaxOfJsService/Request/POST',
			        params: {
			        	cmd:"spring:baseSystemBusiness#getPublicKey",
			        	request_date:""+new Date().getTime()
			        },
			        method: 'POST',
			        success: function (response, options) {
			        	var msg = Ext.JSON.decode(response.responseText);
			        	var encrypt = new JSEncrypt();
			        	encrypt.setPublicKey(msg.datas);
			        	callback(encrypt)
			        },
			        failure: function (response, options) {
			        	Tx.MessageBox.error('请求超时或网络故障,错误编号：' + response.status);
			        }
			    });
			},
			
			getPageCode:function(path,callback){
				var loadMarsk = new Ext.LoadMask(_center,{
					   msg : '正在执行，请稍候......',
					   removeMask : true// 完成后移除
					});
				loadMarsk.show();
				Ext.Ajax.request({
			        url: path,
			        method: 'GET',
			        success: function (response, options) {
			        	callback(response.responseText);
			        	loadMarsk.hide();
			        },
			        failure: function (response, options) {
			        	Tx.MessageBox.error('请求超时或网络故障,错误编号：' + response.status);
			        	loadMarsk.hide();
			        }
			    });
			},
			/**
			 *  url       要发送的地址
			 *  dom       当前遮挡的dom节点
			 *  callback  完成后的回调函数
			 */
			get:function(obj){
				var loadMarsk;
				if(obj.dom!=null){
					loadMarsk = new Ext.LoadMask(obj.dom,{
					   msg : '正在执行，请稍候......',
					   removeMask : true// 完成后移除
					});
					loadMarsk.show();
				}
				
				Ext.Ajax.request({
			        url: obj.url,
			        method: 'GET',
			        success: function (response, options) {
			        	var json = response.responseText;
			        	obj.callback(json);
			        	if(obj.dom!=null){
			        		loadMarsk.hide();
			        	}
			        },
			        failure: function (response, options) {
			        	Tx.MessageBox.error('请求超时或网络故障,错误编号：' + response.status);
			        	if(obj.dom!=null){
			        		loadMarsk.hide();
			        	}
			        }
			    });
			},
			/**
			 *  cmd       要发送的地址
			 *  datas   发送给服务器的参数
			 *  dom       当前遮挡的dom节点
			 *  callback  完成后的回调函数
			 */
			post:function(obj){
				obj.dom = obj.dom || null;
				var loadMarsk;
				if(obj.dom!=null){
					loadMarsk = new Ext.LoadMask(obj.dom,{
					   msg : '正在执行，请稍候......',
					   removeMask : true// 完成后移除
					});
					loadMarsk.show();
				}
				
				Ext.Ajax.request({
			        url: 'ExtAjaxOfJsService/Request/POST',
			        async: true,  
			        params: {
			        	cmd:obj.cmd,
			        	datas:$fnDesEncryption(Ext.JSON.encode(obj.datas)),
			        	request_date:""+new Date().getTime()
			        },
			        method: 'POST',
			        success: function (response, options) {
			        	var json = Ext.JSON.decode(response.responseText);
			        	if(json.safety){
			        		json.datas = $fnDesDecrypt(json.datas);
			        	}
			        	if(json.state=="RELOGIN"){
			        		window.loginWindow.show();
			        	}else if(json.state=="ERROR"){
			        		Tx.MessageBox.error(json.msg);
			        		console.log(json.datas);
			        	}else if(json.state=="SUCCESS"){
			        		obj.callback(json);
			        	}
			        	if(obj.dom!=null){
			        		loadMarsk.hide();
			        	}
			        },
			        failure: function (response, options) {
			        	Tx.MessageBox.error('请求超时或网络故障,错误编号：' + response.status);
			        	if(obj.dom!=null){
			        		loadMarsk.hide();
			        	}
			        }
			    });
			}
		}
	});
	Ext.define("Tx.field.XmlTextArea",{
		xtype: 'xmltextarea',
		extend:"Ext.form.TextArea",
		setValue:function(txt){
			var editor = this.editor || null;
			if(editor == null){
				this._initValue=txt;
			}else{
				this.editor.setValue(txt);
			}
		},
		getSubmitData:function(){
			var result = {};
			result[this.name] = this.getValue();
			return result;
		},
		getValue:function(){
			var editor = this.editor || null;
			if(editor == null){
				return this._initValue;
			}else{
				return editor.getValue();
			}
		},
		listeners:{
			afterrender :function( self, eOpts){
				Ext.require("component.libs.codemirror.mode.xml.xml");
				setTimeout(function(){
					var width = $("#"+self.id+"-inputEl").width();
					var height = $("#"+self.id+"-inputEl").height();
					self.editor = CodeMirror.fromTextArea(Ext.getDom(self.id+"-inputEl"), {
					    mode: "text/html",
					    indentWithTabs: true,
					    smartIndent: true,
					    styleActiveLine: true,
					    lineNumbers: true,
					    matchBrackets : true,
					    autofocus: true,
/*					    extraKeys: {"Ctrl-Space": "autocomplete"},
					    hintOptions: {tables: {
					      users: ["name", "score", "birthDate"],
					      countries: ["name", "population", "size"]
					    }}*/
				   });
				   self.editor.setSize(width,height);
				   self._initValue = self._initValue || "";
				   self.editor.setValue(self._initValue);
				   self.editor.setOption("styleActiveLine", {nonEmpty: true});
				   /*self.editor.on("change",function(self_,arg){
					   	self.setValue(self_.getValue());
					});
				   self.editor.setValue(self.getValue());*/
				},100);
				
			}
		},
	});
	Ext.define("Tx.field.JSTextArea",{
		xtype: 'jstextarea',
		extend:"Ext.form.TextArea",
		setValue:function(txt){
			var editor = this.editor || null;
			if(editor == null){
				this._initValue=txt;
			}else{
				this.editor.setValue(txt);
			}
		},
		getSubmitData:function(){
			var result = {};
			result[this.name] = this.getValue();
			return result;
		},
		getValue:function(){
			var editor = this.editor || null;
			if(editor == null){
				return this._initValue;
			}else{
				return editor.getValue();
			}
		},
		listeners:{
			afterrender :function( self, eOpts){
				Ext.require("component.libs.codemirror.mode.javascript.javascript");
				setTimeout(function(){
					var width = $("#"+self.id+"-inputEl").width();
					var height = $("#"+self.id+"-inputEl").height();
					self.editor = CodeMirror.fromTextArea(Ext.getDom(self.id+"-inputEl"), {
					    mode: "application/json",
					    indentWithTabs: true,
					    smartIndent: true,
					    styleActiveLine: true,
					    lineNumbers: true,
					    matchBrackets : true,
					    autofocus: true,
/*					    extraKeys: {"Ctrl-Space": "autocomplete"},
					    hintOptions: {tables: {
					      users: ["name", "score", "birthDate"],
					      countries: ["name", "population", "size"]
					    }}*/
				   });
				   self.editor.setSize(width,height);
				   self._initValue = self._initValue || "";
				   self.editor.setValue(self._initValue);
				   self.editor.setOption("styleActiveLine", {nonEmpty: true});
				   /*self.editor.on("change",function(self_,arg){
					   	self.setValue(self_.getValue());
					});
				   self.editor.setValue(self.getValue());*/
				},100);
				
			}
		},
		
	});
	
	/**
	 * mode 高亮代码的方式
	 * 
	 */
	Ext.define("Tx.field.SQLTextArea",{
		xtype: 'sqltextarea',
		extend:"Ext.form.TextArea",
		setValue:function(txt){
			var editor = this.editor || null;
			if(editor == null){
				this._initValue=txt;
			}else{
				this.editor.setValue(txt);
			}
		},
		getSubmitData:function(){
			var result = {};
			result[this.name] = this.getValue();
			return result;
		},
		getValue:function(){
			var editor = this.editor || null;
			if(editor == null){
				return this._initValue;
			}else{
				return editor.getValue();
			}
		},
		listeners:{
			afterrender :function( self, eOpts){
				Ext.require("component.libs.codemirror.mode.sql.sql");
				setTimeout(function(){
					var width = $("#"+self.id+"-inputEl").width();
					var height = $("#"+self.id+"-inputEl").height();
					self.editor = CodeMirror.fromTextArea(Ext.getDom(self.id+"-inputEl"), {
					    mode: "text/x-sql",
					    indentWithTabs: true,
					    smartIndent: true,
					    lineNumbers: true,
					    matchBrackets : true,
					    styleActiveLine: true,
/*					    autofocus: true,
					    extraKeys: {"Ctrl-Space": "autocomplete"},
					    hintOptions: {tables: {
					      users: ["name", "score", "birthDate"],
					      countries: ["name", "population", "size"]
					    }}*/
				   });
				   self.editor.setSize(width,height);
				   self._initValue =self._initValue || "";
				   self.editor.setValue(self._initValue);
				   self.editor.setOption("styleActiveLine", {nonEmpty: true});
				   /*self.editor.on("change",function(self_,arg){
					   	self.setValue(self_.getValue());
					});
				   self.editor.setValue(self.getValue());*/
				},300);
				
			}
		},
		
	});
	Ext.define("Tx.auto.TxGrid",{
		statics:{
			/**
			 * sqlid        sqlid
			 * callback     回调函数
			 * items        工具栏对象
			 * queryname    查询对象的名称
			 * height       表格高度
			 */
			getGrid:function(obj){
				Tx.auto.TxGrid.getColumns({
					sqlid:obj.sqlid,
					callback:function(result){
						var grid = Tx.auto.TxGrid.getTxGrid({
							sqlid:obj.sqlid,
							items:obj.items,
							queryname:obj.queryname,
							height:obj.height,
							columns:result,
							id:obj.id
						});
						obj.callback(grid);
					}
				});
			},
			/**
			 * 根据配置获取TxGrid的列的信息
			 * 	sqlid     sqlid
			 *  callback  完成后的回调函数
			 */
			getColumns:function(obj){
				Tx.AjaxRequest.post({
					cmd:"spring:baseSystemBusiness#fnGetTableColumns",
					datas:{
						sqlid:obj.sqlid
					},
					dom:null,
					callback:function(result){
						var datas   = Ext.JSON.decode(result.datas);
						var result_ = new Array();
						result_.push({
							header: '', 
							xtype: 'rownumberer',  
							align: 'center', 
							sortable: false 
						});
						for(var i=0;i<datas.length;i++){
							var column={
									text:datas[i].label || datas[i].name,
							}
							var width = datas[i].width || null;
							if(width != null){
								if(/^[0-9]+$/.test(width)){
									column.width =window.parseInt(width);
								}else{
									column.width =width;
								}
							}
							var exatt = datas[i].exatt || null;
							if(exatt != null){
								exatt=eval("var ______exatt="+exatt+"\n\t ______exatt");
								for(var att in exatt){
									column[att]=exatt[att];
								}
							}
							var isready = datas[i].isready || null
							var editor =datas[i].editor || null;
							if(isready!=null){
								isready = isready =="0"?true:false;
								if(isready==false){
									if(editor!=null){
										if(editor=="3"){
											column.editor={
													xtype:"textfield",
											}
										}else if(editor=="1"){
											column.editor={
													xtype:"datetimefield",
											}
										}else if(editor=="0"){
											column.editor={
													xtype:"datefield",
											}
										}
									}
								}
								//column.editor=isready?"":column.editor;
							}
							if(editor == "1"){
								column.renderer=function(value){
									var v = value || null;
									if(v==null){
										return "";
									}else{
										return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
									}
						        }
							}else if(editor == "0"){
								column.renderer=function(value){
									var v =value || null;
									if(v == null){
										return "";
									}else{
										return Ext.util.Format.date(new Date(value),"Y-m-d");
									}
						        }
							}
							
							var hide = datas[i].isshow || false;
							column.hidden =  datas[i].isshow  =="0"? false:true;
							column.dataIndex=datas[i].name;
							result_.push(column);
						}
						var callback = obj.callback || function(){};
						callback(result_);
					}
				});
			},
			/**
			 * columns 列的信息
			 * sqlid   数据库id
			 * items   工具栏元素
			 * queryname 默认显示的查询字段
			 * height   表格的高度
			 */
			getTxGrid:function(obj){
				var columns = obj.columns;
				var queryname= new Array();
				var defaultValue;
				var bool=false;
				for(var i=0;i<columns.length;i++){
					if(columns[i].xtype != "rownumberer" && columns[i].hidden !=true){
						if(bool == false){
							defaultValue=obj.queryname || columns[i].dataIndex;
						}
						queryname.push([columns[i].dataIndex,columns[i].text]);
						bool=true;
					}
				}
				var store = Tx.auto.TxGrid.getStore(obj.sqlid);
				
				var conditionName=defaultValue;
				var conditionValue="";
				var conditionSymbol="0";
				var items=new Array();
				items.push({
					xtype:'combo',
					editable:false,
					store:queryname,
					value:defaultValue,
					listeners:{
						change:function(){
							conditionName=this.value;
						}
					},
				});
				items.push({
					xtype:'combo',
					editable:false,
					width:85,
					store:[
						['0','包含'],
						['1','不包含'],
						['2','等于'],
						['3','大于'],
						['4','大于等于'],
						['5','小于'],
						['6','小于等于'],
						['7','为空'],
						['8','不为空']
					],
					value:"0",
					listeners:{
						change:function(){
							conditionSymbol=this.value;
						}
					},
				});
				function queryDatas(){
					var proxy = store.getProxy();
					proxy.setExtraParams({
						"conditionName":conditionName,
						"conditionValue":conditionValue,
						"conditionSymbol":conditionSymbol,
					});
					store.load();
				}
				items.push({
					xtype : 'textfield',
					listeners:{
						change:function(){
							conditionValue=this.value;
							queryDatas();
						},
						
					}	
				});
				items.push("-")
				items.push({
					text : "查询数据",
					iconCls:"fa fa-search",
					handler:function(){
						queryDatas();
					}
				});
				items.push("-");
				items.push({  
					text : "导出数据",
					iconCls:"fa fa-cloud-download",
					handler:function(){
						var sqlid = obj.sqlid;
						Tx.AjaxRequest.fnDownloadFile(sqlid);
					}
				});
				items.push("-");
				items.push("->");
				var items_ = obj.items || [];
				for(var i=0;i<items_.length;i++){
					items.push(items_[i]);
				}
				var config = {
				    store: store,
				    //title: 'Application Users',
				    plugins:['bufferedrenderer'/*,{
					    ptype : 'rowediting',
					    clicksToEdit : 3,
					    saveBtnText : '保存',
					    autoCancel : true,
					    errorsText : "警告",
					    dirtyText : "当前有数据尚未保存，请选择保存或取消。",
					    cancelBtnText : "取消",
					}*/,{
						ptype: 'cellediting',
				        clicksToEdit: 1
					}],
				    dockedItems: [{
					    dock : 'top',
					    xtype :'toolbar',
					    items :items/*['->',{
							text : "新增数据",
							iconCls : "fa fa-plus-circle ",
							handler:function(){
							    //store.add({});
							    //store.sync();
							}
					    }, {
							text : "删除数据",
							iconCls : "fa fa-times-circle",
							handler : function() {
								Tx.MessageBox.question("您确定要删除当前选中的数据吗？", function() {
								var selection = grid.getView().getSelectionModel().getSelection()[0];
									grid.store.remove(selection);
							    });
							}
					    },{
							text:"刷新数据",
							iconCls:"fa fa-refresh",
							handler:function(){
							   store.load();
							}
					    } ]*/
					},{ 
				    		xtype: "pagingtoolbar",
				    		store: store,
				    		displayInfo: true,
				    		dock:"bottom",
				    		displayMsg: '显示第{0} - {1}条记录 / 共{2}记录',
							emptyMsg: "没有记录",
							items:['-','每页/',{
								xtype:'combo',
								editable:false,
								width:55,
								store:['10','20','50','100','200','500','1000'],
								value:store.pageSize+'',
								listeners:{
									change:function(){
										store.pageSize		= this.value;
										store.reload({limit:this.value});
									}
								},
							},'条记录']
			        }],
				    columns: obj.columns
				}
				obj.id  = obj.id || null;
				if(obj.id!=null){
					config.id = obj.id;
				}
				var height = obj.height || null;
				if(height!=null){
					config.height=obj.height;
				}
				var grid = Ext.create('Ext.grid.Panel', config);
				grid.store.load({
					scope:this,
					callback:function(records, operation, success){
						grid.getSelectionModel().select(0, true); 
					}
				});
				return grid;
			},
			/**
			 * 根据sqlid和model获取Store对象
			 * @parame sqlid 数据库维护的唯一SQLID的编号
			 * @parame model Ext.data.Model对象
			 */
			getStore:function(sqlid){
				var store =  Ext.data.Store.create({
					autoSync : true,
					remoteGroup : true,
					leadingBufferZone : 300,
					pageSize : $$USERINFO.pagesize,
					proxy : {
					    type : 'ajaxtx',
					    url:"ExtAjaxOfJsService/Request/POST",
					    sqlid:sqlid,
					    actionMethods:{read:'POST'},
					    reader : {
							rootProperty : 'datas',
							totalProperty : 'count'
					    },
					    //simpleSortMode : true,
					    //simpleGroupMode : true,
					    //remoteFilter : true,
					    //groupParam : 'sort',
					    //groupDirectionParam : 'dir'
					},
					/*sorters : [ {
					    property : 'id',
					    direction : 'ASC'
					} ],*/
					//autoLoad : true,
					listeners:{
						add:function( store, records, index, eOpts){
							for(var i=0;i<records.length;i++){
								records[i].data.id=window.GUID().replace(/-/g, "");
							}
						}
					}
				});
				store.getModel().identifier=Ext.data.identifier.Uuid.create();
				return store;
			}
		}
	});
})();