package tx.management.tool.extjs.route.service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import tx.database.common.utils.TxSessionFactory;
import tx.database.common.utils.entitys.QuerySqlResult;
import tx.management.tool.extjs.enumeration.CmdService;
import tx.management.tool.extjs.exceptions.TxInvokingException;
import tx.management.tool.extjs.route.service.entitys.RequestEntitys;
import tx.management.tool.extjs.route.service.entitys.ResponseEntitys;
import tx.management.tool.extjs.utils.DES;
import tx.management.tool.extjs.utils.SpringContextUtil;
import tx.management.tool.extjs.utils.StringUtils;

public class ExtAjaxOfJsService extends HttpServlet{
	private static final long serialVersionUID = 7058324705163717385L;
	private static  Properties languageProperties =new Properties(); ;
	public static String getLanguageHint(String HintCode) {
		return languageProperties.getProperty(HintCode);
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String request_date    = req.getParameter("request_date");
		String cmd     = req.getParameter("cmd");
		String datas   = req.getParameter("datas");
		RequestEntitys reqen = new RequestEntitys();
		reqen.setCmd(cmd);
		reqen.setRequest_date(request_date);
		reqen.setDatas(datas);
		reqen.setSession(req.getSession());
		OutputStream out = resp.getOutputStream();
		try {
			TxSessionFactory txsession = SpringContextUtil.getApplicationContext().getBean(TxSessionFactory.class);
			QuerySqlResult result = txsession.getTxSession().select("select * from tx_sys_ajax_authorization where state = 0 ", null);
			List<String> exitcmd = new ArrayList<String>();
			for(Map<String,Object > m : result.getDatas()) {
				exitcmd.add((String)m.get("cmd"));
			}
			if(exitcmd.indexOf(cmd)== -1 && reqen.getSession().getAttribute("USERINFO") == null) {
				ResponseEntitys re = new ResponseEntitys();
				re.setResponse_date(""+new Date().getTime());
				re.setRequest_date(request_date);
				re.setState("RELOGIN");
				out.write(JSON.toJSONString(re).getBytes());
				return;
			}
			//如果当前人员已经登入,那么就自动解密发送的内容
			if(reqen.getSession().getAttribute("USERINFO") != null && exitcmd.indexOf(cmd)== -1) {
				DES des = SpringContextUtil.getApplicationContext().getBean(DES.class);
				String key_0 = (String) reqen.getSession().getAttribute("key_0");
				String key_1 = (String) reqen.getSession().getAttribute("key_1");
				String key_2 = (String) reqen.getSession().getAttribute("key_2");
				String txt = des.Decrypt(reqen.getDatas(), key_0, key_1, key_2);
				reqen.setDatas(txt);
				@SuppressWarnings("unchecked")
				Map<String,Object> r=(Map<String, Object>) reqen.getSession().getAttribute("USERINFO");
				
				ResponseEntitys re = (ResponseEntitys) invokingCmd(reqen);
				re.setRequest_date(request_date);
				re.setResponse_date(""+new Date().getTime());
				re.setState("SUCCESS");

				if((Integer)r.get("safety") == 1) {
					re.setDatas(des.Encrypt(re.getDatas(), key_0, key_1, key_2));
					re.setSafety(true);
				}else {
					re.setSafety(false);
				}
				out.write(JSON.toJSONString(re).getBytes());
				return;
			}else {
				ResponseEntitys re = (ResponseEntitys) invokingCmd(reqen);
				re.setRequest_date(request_date);
				re.setResponse_date(""+new Date().getTime());
				re.setState("SUCCESS");
				out.write(JSON.toJSONString(re).getBytes());
				return;
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
			Throwable ex = StringUtils.getBottomError(e);
			ResponseEntitys re = new ResponseEntitys();
			re.setResponse_date(""+new Date().getTime());
			re.setRequest_date(request_date);
			re.setDatas(StringUtils.getError(e));
			re.setState("ERROR");
			if(ex.getMessage() == null || "".equals(ex.getMessage())) {
				re.setMsg("TX-SYSTEM: java.lang.NullPointerException 未将对象引用到对象实例!");
			}else {
				re.setMsg("TX-SYSTEM: "+ex.getMessage());
			}
			out.write(JSON.toJSONString(re).getBytes());
			return;
		}finally {
			if(out!=null) {
				out.flush();
				out.close();
			}
		}
	}
	
	private Object invokingCmd(RequestEntitys req) throws TxInvokingException, ClassNotFoundException, NoSuchMethodException, SecurityException, IllegalAccessException, IllegalArgumentException, InvocationTargetException {
		String cmd = req.getCmd();
		if(cmd == null || "".equals(cmd)) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000000");
		}else {
			if(StringUtils.testCmdString(cmd)) {
				String res[] = cmd.split(":");
				String[] clazzs = res[1].split("#");
				String type =res[0];
				String bean = clazzs[0];
				String method = clazzs[1];
				if(CmdService.exist(type)) {
					if(type.equalsIgnoreCase(CmdService.java.getValue())) {
						@SuppressWarnings("rawtypes")
						Class clzz = Class.forName(bean);
						@SuppressWarnings("unchecked")
						Method m = clzz.getMethod(method, RequestEntitys.class);
						return m.invoke(null, req);
					}else if(type.equalsIgnoreCase(CmdService.javascript.getValue())) {
						throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
					}else if(type.equalsIgnoreCase(CmdService.spring.getValue())) {
						Object beans = SpringContextUtil.getApplicationContext().getBean(bean);
						Method m = beans.getClass().getMethod(method, RequestEntitys.class);
						return m.invoke(beans, req);
					}else {
						throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
					}
				}else {
					throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
				}
			}else {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000001");
			}
		}
	}
	@Override
	public void init(ServletConfig config) throws ServletException {
		String language = config.getInitParameter("tx-language-path");
		FileInputStream fis = null;
		InputStreamReader reader = null ;
		try {
			String path = config.getServletContext().getResource(language).getPath();
			fis = new FileInputStream(path);
			reader= new InputStreamReader(fis,"UTF-8");
			languageProperties.load(reader);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}finally {
			try {
				reader.close();
				fis.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		super.init(config);
	}
	
}
