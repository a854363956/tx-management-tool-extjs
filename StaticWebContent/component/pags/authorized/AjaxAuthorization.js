(function(){
	var grid;
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
		sqlid:"c074bc807e13411bb04222b180d2fb73",
		queryname:"remarks",
		callback:function(printgrid){
			grid = printgrid;
			printgrid.addListener('rowdblclick', function(self, record, element, rowIndex, e, eOpts){
				record.data.createdate = Ext.util.Format.date(new Date(record.data.createdate),"Y-m-d H:i:s");
				Ext.getCmp("__sql_logs_program_maintenance_page_form_json").getForm().setValues(record.data);
				addData.show();
			});
			center.add(printgrid);
		}
	});
	return cmp;
})();