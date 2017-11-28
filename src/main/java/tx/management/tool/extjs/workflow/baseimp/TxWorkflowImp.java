package tx.management.tool.extjs.workflow.baseimp;

import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import tx.database.common.utils.TxSessionFactory;
import tx.management.tool.extjs.exceptions.TxInvokingException;
import tx.management.tool.extjs.utils.StringUtils;
import tx.management.tool.extjs.workflow.TxWorkflow;
@Service
public class TxWorkflowImp implements TxWorkflow {
	@Resource(name="TxSessionFactory")
	private TxSessionFactory txSessionFactory;
	
	@Override
	public int getCountRunTask(String stencil_id) throws SQLException {
		Map<String,Object> parame = new HashMap<String,Object>();
		parame.put("stencil_id", stencil_id);
		List<Map<String, Object>> o =txSessionFactory.getTxSession().select("select * from tx_workflow_datas where stencil_id=${stencil_id}", parame).getDatas();
		return o.size();
	}


	@Override
	public List<Map<String, Object>> getTaskAllInfo(String stencil_id) throws SQLException {
		Map<String,Object> parame = new HashMap<String,Object>();
		parame.put("stencil_id", stencil_id);
		return txSessionFactory.getTxSession().select("select * from tx_workflow_datas where stencil_id=${stencil_id}", parame).getDatas();
	}


	@Override
	public void createRunTask(String stencil_id, Map<String, Object> object,String confirmor,String remarks) throws Exception {
		Map<String,Object> sinfo = getStencilInfo(stencil_id);
		if(sinfo == null) {
			throw new Exception("tx_workflow_stencil id '"+stencil_id+"' data is null ");
		}else {
			//0表示按顺序生成,1表示时间-单据序号
			int serial_number_rules = (int) sinfo.get("serial_number_rules");
			//多长时间未处理表示需要通知,单位小时
			int out_time            = (int) sinfo.get("out_time");
			//是否邮件通知0表示否,1表示是
			int emain_notification  = (int) sinfo.get("emain_notification");
			//是否短信通知0表示否,1表示是
			int sms_notification    = (int) sinfo.get("sms_notification");
			//通知周期-1表示只通知一次,单位时间,1表示每一小时通知一次
			int cycle_notification  = (int) sinfo.get("cycle_notification");
			//序号的总长度,不足的补零
			int serial_number_size  = (int) sinfo.get("serial_number_size");
			//前缀字符,也就是序号的前缀
			String prefix_string    = (String) sinfo.get("prefix_string");
			
			Map<String,Object> parame = new HashMap<String,Object>();
			Map<String,Object> sdata = txSessionFactory.getTxSession().select("select count(1) as count from  tx_workflow_datas where  stencil_id=${stencil_id}", parame).getDatas().get(0);
			//生成的新的序号
			String instance_number = String.format("%0" + serial_number_size + "d", (int) sdata.get("count")+1);
			
			Map<String,Object> data = new HashMap<String,Object>();
			data.put("id", StringUtils.getUUID());
			data.put("stencil_id", stencil_id);
			//如果生成的规则不是0并且也不是1那么这个数据就是无效的数据
			if(serial_number_rules!=0 && serial_number_rules !=1) {
				throw new Exception("tx_workflow_stencil serial_number_rules '"+serial_number_rules+"' is invalid!  ");
			}
			
			if(serial_number_rules == 0) {
				data.put("instance_number",prefix_string+ instance_number);
			}else if(serial_number_rules == 1){
				instance_number =prefix_string+StringUtils.ymd.format(new Date())+"-"+instance_number;
				data.put("instance_number",instance_number);
			}
			int current_status =0;
			//0表示开始状态
			data.put("current_status", current_status);
			data.put("confirmor", confirmor);
			data.put("confirm_date", new Date());
			data.put("remarks", remarks);
			txSessionFactory.getTxSession().save("tx_workflow_datas", data);
			
			Timer timer = new Timer(); 
			NoticeTimerTask ntt = new NoticeTimerTask((String)data.get("id"),current_status,emain_notification,sms_notification,txSessionFactory);
			if(cycle_notification == -1) {
				timer.schedule(ntt, 3600000*out_time);
			}else {
				timer.schedule(ntt, 3600000*out_time ,3600000*cycle_notification);
			}
			
			
		}
	}


	@Override
	public Map<String, Object> getStencilInfo(String stencil_id) throws SQLException {
		Map<String,Object> parame = new HashMap<String,Object>();
		parame.put("id", stencil_id);
		return txSessionFactory.getTxSession().select("select * from tx_workflow_stencil where id=${id}", parame).getDatas().get(0);
	}
}
class NoticeTimerTask extends TimerTask{
	
	public String id;
	private TxSessionFactory txSessionFactory;
	private int status;
	public NoticeTimerTask(String id,int status,int emain_notification,int sms_notification,TxSessionFactory txSessionFactory) {
		this.id = id;
		this.status = status;
		this.txSessionFactory = txSessionFactory;
	}
	@Override
	public void run() {
		try {
			Map<String,Object> parame = new HashMap<String,Object>();
			parame.put("id", this.id);
			Map<String,Object> result = txSessionFactory.getTxSession().select("select * from  tx_workflow_datas where id = ${id}", parame).getDatas().get(0);
			if(result == null ) {
				throw new SQLException("The current process number is not found '"+ this.id +"'");
			}else {
				int current_status = (int)result.get("current_status");
				if(current_status == this.status) {
					//发送邮件通知
					//发送短信通知
					
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
