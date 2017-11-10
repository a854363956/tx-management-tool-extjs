package tx.management.tool.extjs.route.service.entitys;

public class SqlLogsDatas {
	//线程id
	private String threadid;
	//当前登入的用户
	private String userid;
	//执行的真实的sql语句
	private String realsql;
	//执行sql消耗的时间
	private Long   sqltiming;
	public String getThreadid() {
		return threadid;
	}
	public void setThreadid(String threadid) {
		this.threadid = threadid;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getRealsql() {
		return realsql;
	}
	public void setRealsql(String realsql) {
		this.realsql = realsql;
	}
	public Long getSqltiming() {
		return sqltiming;
	}
	public void setSqltiming(Long sqltiming) {
		this.sqltiming = sqltiming;
	}
	
	
}
