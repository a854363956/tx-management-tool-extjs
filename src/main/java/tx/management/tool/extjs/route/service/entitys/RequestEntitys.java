package tx.management.tool.extjs.route.service.entitys;

import java.util.Map;

import javax.servlet.http.HttpSession;

public class RequestEntitys {
	//调用的命令 脚本类型:类的名称#方法的名称
	private String cmd;
	//当前请求传递的数据
	private String datas;
	//当前请求的数据
	private String request_date;
	//用户会话的session
	private HttpSession session;

	public HttpSession getSession() {
		return session;
	}
	public void setSession(HttpSession session) {
		this.session = session;
	}
	public String getDatas() {
		return datas;
	}
	public void setDatas(String datas) {
		this.datas = datas;
	}
	public String getRequest_date() {
		return request_date;
	}
	public void setRequest_date(String request_date) {
		this.request_date = request_date;
	}
	public String getCmd() {
		return cmd;
	}
	public void setCmd(String cmd) {
		this.cmd = cmd;
	}
	@SuppressWarnings("unchecked")
	public String getRoleId() {
		Map<String,Object> result = (Map<String,Object>)session.getAttribute("USERROLEINFO");
		String id = (String) result.get("id");
		return id;
	}
}
