/**
 * 前端的UI页面可视化开发
 * @returns
 */
(function(){
	var cmp = Ext.Panel.create({
		region : 'center',
		layout : "border",
		items:[]
	});
	var tree = Ext.panel.Panel.create({
		region : 'west',
		minWidth:120,
		split : true,
		hideHeaders : true,
		width : "18%",
		title:"所有控件列表",
		collapsible : true,
		layout: 'accordion', //手风琴布局
	    layoutConfig: {
	        titleCollapse: false,
	        animate: true,
	        activeOnTop: true
	    },
	    items: []
	});
	var top = Ext.toolbar.Toolbar.create({
		region : "north",
		items : [{
			text:"新建页面"
		},{
			text:"打开页面"
		},{
			text:"保存页面"
		}]
	});
	
	var attr = Ext.panel.Panel.create({
		region : 'east',
		minWidth:120,
		split : true,
		hideHeaders : true,
		width : "18%",
		title:"操作中心",
		collapsible : true,
		layout: 'accordion', //手风琴布局
	    layoutConfig: {
	        titleCollapse: false,
	        animate: true,
	        activeOnTop: true
	    },
	    items: []
	});
	//----------------------初始化tabpanel
	var v_editor = Ext.Panel.create({
		region : 'center',
		layout:{  
	        type:'hbox',  
	        align : 'stretch',  
	        pack  : 'start'  
	    },  
	    defaults:{  
	       flex:1  
	    },  
		items:[{
			xtype:"jstextarea",
		}]
	});
	var center = Ext.TabPanel.create({
        region : 'center',
        activeTab : 0,
        items : [],
    });
	
	center.add({
		title : "源码编辑",
		id : "_D_0",
		layout : "border",
		items : [ v_editor ],
     }).show();
	center.add({
		title : "可视化编辑",
		id : "_D_1",
		layout : "border",
		items : [],
     });
	//----------------------
	
	//添加控件
	//--------------
	cmp.add(top);
	cmp.add(tree);
	cmp.add(attr);
	cmp.add(center);
	//---------------
	
	
	return cmp;
})();