function main(){
	Ext.define('MODEL', {
	    extend: 'Ext.data.Model',
	    fields: [ 'id', 'username', 'password','email','create_time','expiration_date','session_valid' ]
	});
	var grid = Tx.auto.TxGrid.getTxGrid({
		columns:[{
			header: '', 
			xtype: 'rownumberer',  
			align: 'center', 
			sortable: false 
		},
	    {
	        text: '查询数据的SQL数据源',
	        flex: 2,
	        dataIndex: 'querysql'
	    },{
	        text: '对数据源进行汇总的SQL',
	        flex: 2,
	        dataIndex: 'countsql',
	        
	    },
	    {
	        text: '数据源的描述',
	        flex: 1,
	        dataIndex: 'description',
	    },
	    {
	        text: '创建日期',
	        flex: 1,
	        dataIndex: 'createdate',
	        renderer:function(value){
	        	return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
	        }
	    },
	    {
	        text: '最后修改日期',
	        flex: 1,
	        dataIndex: 'updatetime',
	        renderer:function(value){
	        	return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
	        }
	    }],
	    sqlid:"0"
	});

	var center = Ext.Panel.create({
		region : 'center',
		layout:{  
	        type:'hbox',  
	        align : 'stretch',  
	        pack  : 'start'  
	    },  
	    defaults:{  
        //子元素平均分配宽度  
           flex:1  
	    },  
		items:[grid]
	});
	
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[center]
	});
	return cmp;
}
main();

