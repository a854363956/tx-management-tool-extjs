package tx.management.tool.extjs.utils;

import java.io.IOException;
import java.util.List;

import tx.management.tool.extjs.route.service.ExtJsAnnotationService;


public class JsAnnotationUtils {
	private String text;
	public JsAnnotationUtils(String text) {
		this.text = text;
	}
	
	public List<String> findGridAnnotation() {
		String regular = "//@Grid\\(\\s*\"[A-Za-z0-9]+\"\\s*\\)[\\s\\S]*?;";
		return StringUtils.findRegex(this.text, regular);
	}
	public String findGridAnnotationSqlid(String grid) throws Exception {
		String regular = "\\(\\s*\"[A-Za-z0-9]+\"\\s*\\)";
		List<String> result = StringUtils.findRegex(grid, regular);
		if(result.size()!=1) {
			throw new Exception("Grammatical nonstandard \n"+grid);
		}else {
			String data = result.get(0);
			return data.substring(2, data.length()-2);
		}
	}
	public String findGridVarName(String grid) throws Exception {
		String regular = "var\\s+[A-Za-z0-9]+;";
		List<String> result = StringUtils.findRegex(grid, regular);
		if(result.size()!=1) {
			throw new Exception("Grammatical nonstandard \n"+grid);
		}else {
			return result.get(0);
		}
	}
	public String getRealGridData(String preprocessing,String templates) {
		String datas = preprocessing.substring(0, preprocessing.length()-1);
		datas=datas+" ="+templates;
		return datas;
	}
	
	public String readTemplatesDatas(String name) throws IOException {
		return ExtJsAnnotationService.readAnnontitionFile(name);
	}
	
	
}
