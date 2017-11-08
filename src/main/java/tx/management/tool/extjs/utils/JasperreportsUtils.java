package tx.management.tool.extjs.utils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporter;
import net.sf.jasperreports.engine.JRParameter;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.engine.export.JRRtfExporter;
import net.sf.jasperreports.engine.query.JsonQueryExecuterFactory;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jasperreports.export.Exporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;

/**
 * 用来处理报表的工具类
 * @author 张尽
 * @email  zhangjin0908@hotmail.com
 * @qq     854363956
 * @date 2017年11月8日 上午10:24:03
 */
public class JasperreportsUtils {
	public static JasperPrint getJasperPrint(File jrxml,String json) throws JRException {
		JasperDesign design =JRXmlLoader.load(jrxml);
		Map<String, Object> paramsMap = new HashMap<String, Object>();
		InputStream is = new ByteArrayInputStream(json.getBytes());
	    paramsMap.put("JSON_INPUT_STREAM", is);
	    paramsMap.put(JsonQueryExecuterFactory.JSON_LOCALE, Locale.ENGLISH);
	    paramsMap.put(JRParameter.REPORT_LOCALE, Locale.CHINA);
	    JasperReport report = JasperCompileManager.compileReport(design);
	    return JasperFillManager.fillReport(report, paramsMap);
	}
	/**
	 * 导出pdf字节
	 * @param jrxml 源文件
	 * @param json  json数据对象
	 * @return
	 * @throws JRException
	 */
	public static byte[] getPdfBytesJasperreports(File jrxml,String json) throws JRException {
	    return JasperExportManager.exportReportToPdf(getJasperPrint(jrxml,json));
	}
	/**
	 * 导出html文件
	 * @param jrxml  源文件
	 * @param json   json数据
	 * @return
	 * @throws JRException
	 * @throws IOException
	 */
	 @SuppressWarnings({ "unchecked", "rawtypes" })
	public static byte[] getHtmlBytesJasperreports(File jrxml,String json) throws JRException, IOException {
		 ByteArrayOutputStream out = new ByteArrayOutputStream();
		 Exporter exporter= new HtmlExporter();
		 exporter.setExporterOutput(new SimpleHtmlExporterOutput(out));
		 exporter.setExporterInput(new SimpleExporterInput(getJasperPrint(jrxml,json)));
		 exporter.exportReport();
		 return out.toByteArray();
	}

	
}
