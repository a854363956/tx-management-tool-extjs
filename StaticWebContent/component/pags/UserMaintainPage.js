function main(){
	Ext.define('MODEL', {
	    extend: 'Ext.data.Model',
	    fields: [ 'id', 'username', 'password','email','create_time','expiration_date','session_valid' ]
	});
	var grid = Tx.auto.TxGrid.getTxGrid({
		columns:[
	        {
	            text: 'id',
	            dataIndex: 'id'
	        },
	        {
	            text: 'username',
	            dataIndex: 'username',
	        },
	        {
	            text: 'password',
	            flex: 1,
	            dataIndex: 'password'
	        },
	        {
	            text: 'email',
	            flex: 1,
	            dataIndex: 'email'
	        },
	        {
	            text: 'create_time',
	            flex: 1,
	            dataIndex: 'create_time',
	            renderer:function(value){
	            	return Ext.util.Format.date(new Date(value),"Y-m-d H:i:s");
	            }
	        },
	        {
	            text: 'expiration_date',
	            flex: 1,
	            dataIndex: 'expiration_date',
	        },
	        {
	            text: 'session_valid',
	            flex: 1,
	            dataIndex: 'session_valid'
	        }
	    ],
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

