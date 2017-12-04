package tx.management.tool.extjs.utils;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import tx.management.tool.extjs.exceptions.TxInvokingException;


public class POIUtils {
	/**
	 * 将数据转换成为Excel文件 
	 * @param column      数据列的信息
	 *                        -name   列的名称
	 *                        -label  列的显示名称
	 * @param datas       要导出的数据
	 * @param sheetName   excel的标签页
	 * @return
	 * @throws TxInvokingException
	 * @throws IOException
	 */
	public static byte[] fnQuerySqlResultToExcelBytes(List<Map<String,Object>> column,List<Map<String,Object>> datas,String sheetName) throws TxInvokingException, IOException {
		SimpleDateFormat sdf =new SimpleDateFormat("yyyyMMdd");
		SXSSFWorkbook  workbook = new SXSSFWorkbook();
		Sheet hhsf = workbook.createSheet(sheetName);
		Row first_row = hhsf.createRow(0);
		for(int i=0;i<column.size();i++) {
			String label =(String) column.get(i).get("label");
			Cell cell = first_row.createCell(i);
			cell.setCellValue(label);
		} 
		for(int row = 0;row<datas.size();row++) {
			 Row row_ = hhsf.createRow(row+1);
			for(int col =0;col<column.size();col++) {
				String name  =(String) column.get(col).get("name");
				Object value = datas.get(row).get(name);
				if(value == null) {
					row_.createCell(col).setCellValue("");
				}else if(value instanceof String) {
					row_.createCell(col).setCellValue((String)value);
				}else if(value instanceof Integer) {
					row_.createCell(col).setCellValue((Integer)value);
				}else if(value instanceof Double) {
					row_.createCell(col).setCellValue((Double)value);
				}else if(value instanceof Date) {
					row_.createCell(col).setCellValue(sdf.format(value));
				}else {
					throw TxInvokingException.throwTxInvokingExceptions("TX-000014", value.getClass().getName());
				}
			}
		}
		ByteArrayOutputStream os = null;
		try {
			os = new ByteArrayOutputStream();
			workbook.write(os);
			return os.toByteArray();
		} finally {
			if(os!=null) {
				os.flush();
				os.close();
			}
		}
	}
}

