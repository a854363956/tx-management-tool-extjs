package tx.management.tool.extjs.enumeration;

import org.apache.poi.hssf.record.RecordInputStream;

public enum CmdService {
	spring("spring"),
	java("java"),
	javascript("javascript");
	private String value;
	public String getValue() {
		return value;
	}
	CmdService(String value){
		this.value = value;
	}
	/**
	 * 判断当前的字符是否符合规则
	 * @param value
	 * @return
	 */
	public static boolean exist(String value) {
		if(CmdService.java.value.equalsIgnoreCase(value)) {
			return true;
		}else if(CmdService.spring.value.equalsIgnoreCase(value)) {
			return true;
		}else if(CmdService.javascript.value.equalsIgnoreCase(value)) {
			return true;
		}else {
			return false;
		}
	}
}
