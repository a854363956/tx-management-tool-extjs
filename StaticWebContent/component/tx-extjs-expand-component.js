(function(){
	"use strict";
	window.GUID = function() {
		  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		  });
	}
	Ext.define("Tx.MessageBox",{
		//定义静态方法子类不能继承
		statics:{
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
            question:function(message,onclick){
                Ext.MessageBox.show({
                    title: '系统消息',
                    msg: message,
                    buttons: Ext.MessageBox.OKCANCEL,
                    fn:onclick||function(){},
                    icon: Ext.MessageBox.QUESTION
                });
            },
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
				return $des_encrypt(txt,Ext.util.Cookies.get("key_0"),Ext.util.Cookies.get("key_1"),Ext.util.Cookies.get("key_2"));
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
				return $des_decrypt(txt,Ext.util.Cookies.get("key_0"),Ext.util.Cookies.get("key_1"),Ext.util.Cookies.get("key_2"));
			}
		} catch (e) {
		}
	}
	Ext.define("Tx.AjaxRequest",{
		statics:{
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
			 *  cmd       要发送的地址
			 *  parames   发送给服务器的参数
			 *  dom       当前遮挡的dom节点
			 *  callback  完成后的回调函数
			 */
			post:function(obj){
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
/*					    autofocus: true,
					    extraKeys: {"Ctrl-Space": "autocomplete"},
					    hintOptions: {tables: {
					      users: ["name", "score", "birthDate"],
					      countries: ["name", "population", "size"]
					    }}*/
				   });
				   self.editor.setSize(width,height);
				   self.editor.setValue(self._initValue);
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
			 * 根据配置获取TxGrid的列的信息
			 * [
			 * 	@parame name     对应的绑定的属性名称
			 * 	@parame label    对应的界面的显示名称
			 * 	@parame dataType 对应的数据类型
			 * 				date     日期类型
			 *              datetime 日期加上时间,更加详细的日期类型
			 *              string   字符串类型
			 *              number   数字类型
			 *              double   小数类型
			 *  @parame format   格式化字符串显示的JS脚本
			 *  @parame editor 
			 *              date      日期编辑器
			 *              datetime  日期加上时间,更加详细的日期编辑器
			 *              double    小数编辑器
			 *              number    数字编辑器
			 *              string    文本编辑器
			 *              dropdown  下拉框编辑器
			 * ]
			 */
			getColumns:function(obj){
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
				for(var i=0;i<columns.length;i++){
					if(columns[i].xtype != "rownumberer"){
						queryname.push([columns[i].dataIndex,columns[i].text]);
						defaultValue=obj.queryname || columns[i].dataIndex;
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
				items.push("-")
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
				var height = obj.height || null;
				if(height!=null){
					config.height=obj.height;
				}
				var grid = Ext.create('Ext.grid.Panel', config);
				return grid;
			},
			/**
			 * 根据sqlid和model获取Store对象
			 * @parame sqlid 数据库维护的唯一SQLID的编号
			 * @parame model Ext.data.Model对象
			 */
			getStore:function(sqlid){
				return Ext.data.Store.create({
					autoSync : true,
					remoteGroup : true,
					leadingBufferZone : 300,
					pageSize : 50,
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
					autoLoad : true,
				});
			}
		}
	});
})();