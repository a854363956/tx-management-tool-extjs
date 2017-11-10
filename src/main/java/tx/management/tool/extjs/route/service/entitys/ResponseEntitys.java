package tx.management.tool.extjs.route.service.entitys;

public class ResponseEntitys {
	//当前返回的数据
	private String datas;
	//当前请求的时间
	private String request_date;
	private String msg;
	//当前执行方法完成后返回的时间
	private String response_date;
	private String state;
	private String threadid;
	
	public String getThreadid() {
		return threadid;
	}
	public void setThreadid(String threadid) {
		this.threadid = threadid;
	}
	private boolean isSafety;
	
	public boolean isSafety() {
		return isSafety;
	}
	public void setSafety(boolean isSafety) {
		this.isSafety = isSafety;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
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
	public String getResponse_date() {
		return response_date;
	}
	public void setResponse_date(String response_date) {
		this.response_date = response_date;
	}
	
}
