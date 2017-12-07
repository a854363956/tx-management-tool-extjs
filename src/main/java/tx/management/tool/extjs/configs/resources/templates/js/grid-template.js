(function(){
	var sqlid="${sqlid}";
	var datas=${datas};
	var columns = Tx.auto.TxGrid.toColumns(datas);
	var grid = Tx.auto.TxGrid.getTxGrid({
		sqlid:sqlid,
		columns:columns,
		id:"ID_"+sqlid
	});
	return grid;
})();