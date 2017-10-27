package tx.management.tool.extjs.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import tx.database.common.utils.string.SqlStringUtils;

public class StringUtils {
	private static String cmd = "^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+#[a-zA-Z0-9_]+$";
	private static String field="^[a-zA-Z0-9_]+$";
	private static final String PRIVATE_PASSWORD = "a756268d-68d6-434e-9864-900186b96d51";
	/**
	 * 判断当前的Cmd字符串是否符合规则,如果符合返回true 否则返回false
	 * @param cmd
	 * @return
	 */
	public static boolean testCmdString(String cmd) {
		List<String> result = SqlStringUtils.findRegex(cmd,StringUtils.cmd );
		if(result.size() != 0) {
			return true;
		}else {
			return false;
		}
	}
	/**
	 * 判断当前字符串是否是合法的字段名称
	 * @param field  字段名称
	 * @return       如果是有效的字段名称将返回true否则返回false
	 */
	public static boolean testIsEffectiveField(String field) {
		List<String> result = SqlStringUtils.findRegex(field,StringUtils.field );
		if(result.size() != 0) {
			return true;
		}else {
			return false;
		}
	}
	/**
	 * 读取InputStream中的字符串 
	 * @param datas     
	 * @return
	 * @throws IOException
	 */
	public static String readInputStream(InputStream in) throws IOException {
		ByteArrayOutputStream result = new ByteArrayOutputStream();
		byte[] buffer = new byte[1024];
		int length;
		while ((length = in.read(buffer)) != -1) {
		    result.write(buffer, 0, length);
		}
		return result.toString("UTF-8");
	}
	public static Throwable getBottomError(Throwable e) {
		Throwable ex = e.getCause();
		if(ex == null) {
			return e;
		}else {
			return getBottomError(ex);
		}
		
	}
	
	/**
	 * 将当前的字符串生成唯一的hash值
	 * @param text       当前的字符串
	 * @return           返回Hash值
	 * @throws NoSuchAlgorithmException
	 */
	public static String md5(String text) throws NoSuchAlgorithmException{
        MessageDigest md = MessageDigest.getInstance("MD5");
        md.update((PRIVATE_PASSWORD+text+PRIVATE_PASSWORD).getBytes());
        String result = "00000000000000000000000000000000"+new BigInteger(1, md.digest()).toString(16);
        return result.substring(result.length()-32, result.length());
	}
	
	public static String getError(Throwable e){
		StringWriter sw =null;
		PrintWriter  pw =null; 
		try {
			sw = new StringWriter();   
		  pw = new PrintWriter(sw, true);   
		  e.printStackTrace(pw);   
		  pw.flush();   
		  sw.flush();   
		  return sw.toString(); 
		} finally {
			if(sw!=null){
				try {
					sw.close();
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			}
			if(pw!=null){
				pw.close();
			}
		}
	}
}
