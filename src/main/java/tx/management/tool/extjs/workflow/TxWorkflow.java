package tx.management.tool.extjs.workflow;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface TxWorkflow {
	
	/**
	 * 获取当前流程模版中正在进行的流程
	 * @param stencil_id 流程模版
	 * @return
	 * @throws SQLException 
	 */
	public int getCountRunTask(String stencil_id) throws SQLException;

	/**
	 * 开始一个创建流程的实例
	 * @param stencil_id 流程模版
	 * @param object     参数对象
	 * @throws Exception 
	 */
	public void createRunTask(String stencil_id,Map<String,Object> object,String confirmor,String remarks) throws Exception;
	
	/**
	 * 获取当前流程模版的所有流程信息
	 * @param stencil_id
	 * @return
	 * @throws SQLException 
	 */
	public List<Map<String,Object>> getTaskAllInfo(String stencil_id) throws SQLException; 
	
	/**
	 * 获取模版信息
	 * @param stencil_id  模版编号
	 * @return
	 * @throws SQLException
	 */
	public Map<String,Object> getStencilInfo(String stencil_id) throws SQLException; 
}
