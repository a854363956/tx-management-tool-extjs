/**
 * 打印方案维护
 * @returns
 */
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
	Tx.auto.TxGrid.getGrid({
		sqlid:"40a87a416f6d4670b3206827ee31a76e",
		items:[{
			text:"新增打印方案",
			iconCls : "fa fa-plus-circle",
		},{
			text:"移除打印方案",
			iconCls : "fa fa-minus-circle ",
		},'-',{
			text : "查看打印方案源码",
			iconCls:"fa fa-television"
		}],
		queryname:"printname",
		callback:function(printgrid){
			center.add(printgrid);
		}
	});
	return cmp;
})();