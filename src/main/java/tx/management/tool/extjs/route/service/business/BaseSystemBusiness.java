package tx.management.tool.extjs.route.service.business;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;

import net.sf.jasperreports.engine.JRException;
import tx.database.common.utils.Transactional;
import tx.database.common.utils.TxSessionFactory;
import tx.database.common.utils.entitys.QuerySqlResult;
import tx.database.common.utils.interfaces.TxSession;
import tx.database.common.utils.string.SqlStringUtils;
import tx.management.tool.extjs.enumeration.CmdService;
import tx.management.tool.extjs.exceptions.TxInvokingException;
import tx.management.tool.extjs.route.service.ExtAjaxOfJsService;
import tx.management.tool.extjs.route.service.entitys.RequestEntitys;
import tx.management.tool.extjs.route.service.entitys.ResponseEntitys;
import tx.management.tool.extjs.utils.JasperreportsUtils;
import tx.management.tool.extjs.utils.POIUtils;
import tx.management.tool.extjs.utils.RSA;
import tx.management.tool.extjs.utils.SpringContextUtil;
import tx.management.tool.extjs.utils.StringUtils;
/**
 * 系统需要运行的业务类
 * @author 张尽
 * @email  zhangjin0908@hotmail.com
 * @qq     854363956
 * @date 2017年10月30日 下午3:05:20
 */
@Controller
public class BaseSystemBusiness {
	@Resource(name="TxSessionFactory")
	private TxSessionFactory txSessionFactory;
	
	/**
	 * 获取组件的信息
	 * @param re
	 * @return
	 * @throws SQLException
	 */
	public ResponseEntitys fnGetComponentInfo(RequestEntitys re) throws SQLException {
		Map<String,Object> parame = new HashMap<String,Object>();
		parame.put("cname", JSON.parseObject(re.getDatas()).getString("cname"));
		List<Map<String,Object>> datas = txSessionFactory.getTxSession().select("select * from tx_sys_component where cname = ${cname}", parame).getDatas();
		ResponseEntitys rpe = new ResponseEntitys();
		rpe.setDatas(JSON.toJSONString(datas));
		return rpe;
	}
	/**
	 * 获取操作系统的一些信息  暂时不使用,考虑到群集此方法设计有问题
	 * @param re
	 * @return
	 */
	@Deprecated
	public ResponseEntitys fnGetSysTemInfo(RequestEntitys re) {
		//java当前虚拟机最大内存
		long jvmMaxMemory   = Runtime.getRuntime().maxMemory();
		//java当前虚拟机已分配内存
		long jvmTotalMemory = Runtime.getRuntime().totalMemory();
		//可分配内存
		long jvmRreeMemory  = Runtime.getRuntime().freeMemory();
		Map<String,Object> result = new HashMap<String,Object>();
		result.put("jvmMaxMemory", jvmMaxMemory);
		result.put("jvmTotalMemory", jvmTotalMemory);
		result.put("jvmRreeMemory", jvmRreeMemory);
		
		List<Map<String,Object>> threads = new ArrayList<Map<String,Object>>();
		Map<Thread, StackTraceElement[]> map=Thread.getAllStackTraces(); 
		Iterator<Thread> it=map.keySet().iterator();
		while (it.hasNext()) {
			Thread t=(Thread) it.next(); 
			Map<String,Object> parames = new HashMap<String,Object>();
			parames.put("name", t.getName());
			parames.put("state", t.getState());
			threads.add(parames);
		}
		result.put("threads", threads);
		ResponseEntitys rpe = new ResponseEntitys();
		rpe.setDatas(JSON.toJSONString(result));
		return rpe;
	}
	
	@SuppressWarnings("unchecked")
	public ResponseEntitys fnUpdatePassword(RequestEntitys re) throws TxInvokingException, SQLException, NoSuchAlgorithmException {
		JSONObject datas = JSON.parseObject(re.getDatas());
		String password       = datas.getString("password");
		String newPassword    = datas.getString("newPassword") == null ?    "" : datas.getString("newPassword");
		String twoNewPassword = datas.getString("twoNewPassword") == null ? "" : datas.getString("newPassword");
		if(newPassword.equals(twoNewPassword)) {
				
			Map<String,Object> userinfo =(Map<String, Object>) re.getSession().getAttribute("USERINFO");
			if(!(StringUtils.md5(password).equals((String)userinfo.get("password")))) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000018");
			}
			String id = (String) userinfo.get("id");
			Map<String,Object> updateUser = new HashMap<String,Object>();
			updateUser.put("id", id);
			updateUser.put("password", StringUtils.md5(newPassword));
			int i = txSessionFactory.getTxSession().update("tx_base_user", updateUser);
			ResponseEntitys rpe = new ResponseEntitys();
			rpe.setDatas(""+i);
			return rpe;
		}else {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000017");
		}
	}
	/**
	 * 保存录入的打印参数
	 * @param re
	 * @return
	 * @throws SQLException
	 */
	public ResponseEntitys fnSavePrintPage(RequestEntitys re) throws SQLException {
		Map<String,Object>  j = JSON.parseObject(re.getDatas(),new TypeReference<Map<String,Object>>(){});
		ResponseEntitys rpe = new ResponseEntitys();
		int i = txSessionFactory.getTxSession().save("tx_sys_print", j);
		rpe.setDatas(""+i);
		return rpe;
	}
	public byte[] fnCreateDirectPrintPage(RequestEntitys re) throws SQLException, TxInvokingException, JRException, IOException {
		JSONObject j   = JSON.parseObject(re.getDatas());
		String printid = j.getString("printid");
		String datas   = j.getString("datas");
		Map<String,Object> sqlparame  = new HashMap<String,Object>();
		sqlparame.put("id", printid);
		QuerySqlResult qsr = txSessionFactory.getTxSession().select("select * from tx_sys_print where id=${id}", sqlparame);
		List<Map<String,Object>> datas_ = qsr.getDatas();
		if(datas_.size() == 0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000016", printid);
		}else {
			String  content =(String) datas_.get(0).get("content");
			ByteArrayInputStream in = new ByteArrayInputStream(content.getBytes());
			byte[] bytes = JasperreportsUtils.getHtmlBytesJasperreports(in, datas);
			String html = new String(bytes);
			html = html.replace("<head>", "<head><style type=\"text/css\" media=\"print\">\r\n" + 
					" @page \r\n" + 
					" {\r\n" + 
					" size: auto;/* auto is the initial value */\r\n" + 
					" margin: 0mm;/* this affects the margin in the printer settings */\r\n" + 
					" }\r\n" + 
					"</style>\r\n" + 
					"<script type=\"text/javascript\">\r\n" + 
					"	(function(){\r\n" + 
					"               window.print();\r\n" + 
					"	})();\r\n" + 
					"</script>");
			return html.getBytes();
		}
	}
	
	/**
	 * 预览打印当前页面 
	 * @param re            创建打印的页面
	 * @throws SQLException
	 * @throws TxInvokingException
	 * @throws JRException
	 * @throws IOException
	 */
	public byte[] fnCreatePrintPage(RequestEntitys re) throws SQLException, TxInvokingException, JRException, IOException {
		JSONObject j   = JSON.parseObject(re.getDatas());
		String printid = j.getString("printid");
		String datas   = j.getString("datas");
		Map<String,Object> sqlparame  = new HashMap<String,Object>();
		sqlparame.put("id", printid);
		QuerySqlResult qsr = txSessionFactory.getTxSession().select("select * from tx_sys_print where id=${id}", sqlparame);
		List<Map<String,Object>> datas_ = qsr.getDatas();
		if(datas_.size() == 0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000016", printid);
		}else {
			String  content =(String) datas_.get(0).get("content");
			ByteArrayInputStream in = new ByteArrayInputStream(content.getBytes());
			byte[] bytes = JasperreportsUtils.getHtmlBytesJasperreports(in, datas);
			String html = new String(bytes);
			html = html.replace("<head>", "<head><style type=\"text/css\" media=\"print\">\r\n" + 
					" @page \r\n" + 
					" {\r\n" + 
					" size: auto;/* auto is the initial value */\r\n" + 
					" margin: 0mm;/* this affects the margin in the printer settings */\r\n" + 
					" }\r\n" + 
					"</style>\r\n" + 
					"<script type=\"text/javascript\">\r\n" + 
					"	(function(){\r\n" + 
					"               window.parent._print_loadMarsk.hide()\r\n" + 
					"	})();\r\n" + 
					"</script>");
			return html.getBytes();
		}
	}
	/**
	 * 添加方言
	 * @param re
	 * @return
	 * @throws SQLException
	 * @throws TxInvokingException
	 */
	public ResponseEntitys fnAddDialect(RequestEntitys re) throws SQLException, TxInvokingException {
		Map<String,Object> j = JSON.parseObject(re.getDatas(),new TypeReference<Map<String,Object>>(){});
		QuerySqlResult qsr = txSessionFactory.getTxSession().select("select * from tx_base_language where languagecode =${languagecode} and name =${name}", j );
		if(qsr.getDatas().size() !=0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000015",(String)j.get("languagecode"),(String)j.get("name"));
		}
		j.put("id", StringUtils.getUUID());
		int i =txSessionFactory.getTxSession().create("tx_base_language", j );
		ResponseEntitys rpe = new ResponseEntitys();
		rpe.setDatas(""+i);
		return rpe;
	}
	
	/**
	 * 对菜单进行授权操作
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnAuthorizeMmenu(RequestEntitys re) throws Exception {
		Transactional t = null; 
		try {
			t=txSessionFactory.getTxSession().openTransactional();
			JSONObject j  = JSON.parseObject(re.getDatas());
			String state  = j.getString("state");
			String id     = j.getString("id");
			String father = j.getString("father");
			Map<String,Object> sqlparame = new HashMap<String,Object>();
			sqlparame.put("id", id);
			sqlparame.put("state", state);
			int i =txSessionFactory.getTxSession().update("tx_sys_menu_authorization", sqlparame);
			sqlparame.put("id", father);
			///father
			i+=txSessionFactory.getTxSession().update("tx_sys_menu_authorization", sqlparame);
			ResponseEntitys rpe = new ResponseEntitys();
			rpe.setDatas(""+i);
			t.commit();
			return rpe;
		}catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		}
		
	}
	/**
	 * 删除角色信息
	 * @param re
	 * @return
	 * @throws Exception
	 */
	public ResponseEntitys fnDeleteCharacter(RequestEntitys re) throws Exception {
		Transactional t = null; 
		try {
			 int i=0;
			 t=txSessionFactory.getTxSession().openTransactional();
			 String id =JSON.parseObject(re.getDatas()).getString("id");
			 if(id == null || "".equals(id)) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000011");
			 }else {
				i=txSessionFactory.getTxSession().delete("tx_base_role", id);
				Map<String,Object> parames = new HashMap<String,Object>();
				parames.put("roleid", id);
				i+=txSessionFactory.getTxSession().delete("tx_sys_menu_authorization", parames);
			 }
			 ResponseEntitys res = new ResponseEntitys();
			 res.setDatas(""+i);
			 t.commit();
			 return res;
		} catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		} 
	}
	/**
	 * 删除菜单节点
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnDeleteMenu(RequestEntitys re) throws Exception {
		Transactional t = null; 
		try {
			t=txSessionFactory.getTxSession().openTransactional();
			int i =0;
			String id =JSON.parseObject( re.getDatas()).getString("id");
			if(id == null || "".equals(id)) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000011");
			}else {
				int num = txSessionFactory.getTxSession().delete("tx_sys_menu", id);
				i+=num;
				Map<String,Object> sqlparame = new HashMap<String,Object>();
				sqlparame.put("menuid", id);
				List<Map<String,Object>> datas = txSessionFactory.getTxSession().select("select * from tx_sys_menu_authorization where menuid =${menuid} ", sqlparame).getDatas();
				for(Map<String,Object> m : datas) {
					num = txSessionFactory.getTxSession().delete("tx_sys_menu",(String) m.get("id"));
					i+=num;
				}
				ResponseEntitys rep = new ResponseEntitys();
				rep.setDatas(""+i);
				 t.commit();
				return rep;
			}
		} catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		}

	}
	
	/**
	 * 添加角色信息
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnAddRole(RequestEntitys re) throws Exception {
		Transactional t = null;
		int i=0;
		try {
			Map<String,Object> parame = JSON.parseObject(re.getDatas());
			String roleid = StringUtils.getUUID();
			parame.put("id", roleid);
			t=txSessionFactory.getTxSession().openTransactional();
			
			int n_ =txSessionFactory.getTxSession().create("tx_base_role", parame);
			i+=n_;
			List<Map<String,Object>> datas =txSessionFactory.getTxSession().select("select * from tx_sys_menu", null).getDatas();
			for(Map<String,Object> map : datas) {
				Map<String,Object> ma = new HashMap<String,Object>();
				ma.put("id", StringUtils.getUUID());
				ma.put("roleid", roleid);
				ma.put("menuid", map.get("id"));
				ma.put("state", 1);
				int num = txSessionFactory.getTxSession().create("tx_sys_menu_authorization", ma);
				i+=num;
			}
			ResponseEntitys rpe = new ResponseEntitys();
			rpe.setDatas(""+i);
			t.commit();
			return rpe;
		}catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		}
	}
	/**
	 * 根据sqlid 导出Excel数据
	 * @param re
	 * @return
	 * @throws SQLException
	 * @throws TxInvokingException
	 * @throws IOException
	 */
	public byte[] fnDownloadFile(RequestEntitys re) throws SQLException, TxInvokingException, IOException {
		String sqlid = JSON.parseObject(re.getDatas()).getString("sqlid");
		Map<String,Object> parame = new HashMap<String,Object>();
		parame.put("id", sqlid);
		QuerySqlResult qsr = txSessionFactory.getTxSession().select("select * from tx_sys_grid where id=${id}", parame);
		if(qsr.getDatas().size() == 0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000006", sqlid);
		}else {
			List<Map<String,Object>> datas =  txSessionFactory.getTxSession().select((String)qsr.getDatas().get(0).get("querysql"),null).getDatas();
			parame.clear();
			parame.put("gridid", sqlid);
			List<Map<String, Object>> cols  =  txSessionFactory.getTxSession().select(getRealSQL("select\r\n" + 
					"  s.name,\r\n" + 
					"  e.label\r\n" + 
					"from\r\n" + 
					"  tx_sys_grid_columns s\r\n" + 
					"  left join tx_base_language e on e.name = s.name\r\n" + 
					"  and e.languagecode = '$${language}' where s.gridid = ${gridid} and  s.isshow = 0  order by s.serialnumber ", re),parame).getDatas();
			return POIUtils.fnQuerySqlResultToExcelBytes(cols, datas, (String)qsr.getDatas().get(0).get("description"));
		}
	}
	
	/**
	 * 保存修改的菜单节点对象
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnSaveMenuNode(RequestEntitys re) throws Exception {
		Transactional t =null ;
		try {
			t=txSessionFactory.getTxSession().openTransactional();
			Map<String,Object> parame= JSON.parseObject(re.getDatas(),new TypeReference<Map<String,Object>>(){});
			int i =txSessionFactory.getTxSession().save("tx_sys_menu", parame);  
			ResponseEntitys rpe = new ResponseEntitys();
			List<Map<String,Object>> result = txSessionFactory.getTxSession().select("select * from tx_base_role", null).getDatas();
			for(Map<String,Object> m :result) {
				Map<String,Object> sparame = new HashMap<String,Object>();
			    sparame.put("menuid", parame.get("id"));
			    List<Map<String, Object>> datas__ = txSessionFactory.getTxSession().select("select * from tx_sys_menu_authorization where menuid=${menuid}",sparame).getDatas();
			    if(datas__.size() == 0) {
			    	Map<String,Object> ma = new HashMap<String,Object>();
			    	ma.put("id", StringUtils.getUUID());
			    	ma.put("roleid", m.get("id"));
			    	ma.put("menuid", parame.get("id"));
			    	ma.put("state", 1);
			    	int num = txSessionFactory.getTxSession().create("tx_sys_menu_authorization", ma);
			    	i+=num;
			    }
			}
			rpe.setDatas(""+i);
			t.commit();
			return rpe;
		} catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		}
		
	}
	/**
	 * 创建节点菜单
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnCreateMenuNode(RequestEntitys re) throws Exception {
		Transactional t =null ;
		try {
			t=txSessionFactory.getTxSession().openTransactional();
			ResponseEntitys rpe = new ResponseEntitys();
			JSONObject j = JSON.parseObject(re.getDatas());
			String father = j.getString("father");
			String nodename = j.getString("name");
			Map<String,Object> sqlparame = new HashMap<String,Object>();
			sqlparame.put("father", father);
			List<Map<String,Object>> l =txSessionFactory.getTxSession().select("select max(sorting) as max_  from tx_sys_menu where father =${father}", sqlparame).getDatas();
			String max = "";
			if( l.size() ==0) {
				max="0";
			}else {
				Object max_=l .get(0).get("max_");
				max=""+( max_==null?0:((Integer)max_)+1);
			}
			sqlparame.clear();
			String id =StringUtils.getUUID();
			sqlparame.put("id", id);
			sqlparame.put("path", "0");
			sqlparame.put("icon_class", "default");
			sqlparame.put("sorting", max);
			sqlparame.put("leaf", "0");
			sqlparame.put("father", father);
			sqlparame.put("label", nodename);
			int i= txSessionFactory.getTxSession().create("tx_sys_menu", sqlparame);
			List<Map<String,Object>> result = txSessionFactory.getTxSession().select("select * from tx_base_role", null).getDatas();
			for(Map<String,Object> m :result) {
				Map<String,Object> ma = new HashMap<String,Object>();
				ma.put("id", StringUtils.getUUID());
				ma.put("roleid", m.get("id"));
				ma.put("menuid", id);
				ma.put("state", 1);
				int num = txSessionFactory.getTxSession().create("tx_sys_menu_authorization", ma);
				i+=num;
			}
			rpe.setDatas(""+i);
			t.commit();
			return rpe;
		} catch (Exception e) {
			if(t!=null) {
				t.rollback();
			}
			throw e;
		}
	}
	public ResponseEntitys fnGetMaxMenuSorting(RequestEntitys re) throws SQLException {
		ResponseEntitys rpe = new ResponseEntitys();
		JSONObject j = JSON.parseObject(re.getDatas());
		String father = j.getString("father");
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("father", father);
		List<Map<String,Object>> l =txSessionFactory.getTxSession().select("select max(sorting) as max_  from tx_sys_menu where father =${father}", sqlparame).getDatas();
		String max = "";
		if( l.size() ==0) {
			max="0";
		}else {
			Object max_=l .get(0).get("max_");
			max=""+( max_==null?0:((Integer)max_)+1);
		}
		rpe.setDatas(max);
		return rpe;
	}
	/**
	 * 初始化用户密码
	 * @param re
	 * @return
	 * @throws SQLException
	 */
	public ResponseEntitys fnOnInitPassword(RequestEntitys re) throws SQLException {
		JSONObject j = JSON.parseObject(re.getDatas());
		String userid = j.getString("userid");
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("id", userid);
		sqlparame.put("password", "22c78eece78866c3a5f7b46321403e1a");
		int i =txSessionFactory.getTxSession().update("tx_base_user", sqlparame);
		ResponseEntitys rpe = new ResponseEntitys();
		rpe.setDatas(""+i);
		return rpe;
	}
	
	/**
	 * 将自定的用户进行角色的变更
	 * @param re
	 * @return
	 * @throws SQLException 
	 */
	public ResponseEntitys fnRoleChange(RequestEntitys re ) throws SQLException {
		ResponseEntitys rpe = new ResponseEntitys();
		JSONObject j = JSON.parseObject(re.getDatas());
		String userid = j.getString("userid");
		String changeRoleid = j.getString("change_roleid");
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("userid", userid);
		QuerySqlResult qsr = txSessionFactory.getTxSession().select("select * from tx_base_role_mapping where userid=${userid} ",sqlparame);
		if(qsr.getDatas().size() == 0) {
			sqlparame.put("id",StringUtils.getUUID());
			sqlparame.put("roleid", changeRoleid);
			int i = txSessionFactory.getTxSession().save("tx_base_role_mapping", sqlparame);
			rpe.setDatas(""+i);
			return rpe;
		}else {
			sqlparame.put("id",qsr.getDatas().get(0).get("id") );
			sqlparame.put("roleid", changeRoleid);
			int i = txSessionFactory.getTxSession().update("tx_base_role_mapping", sqlparame);
			rpe.setDatas(""+i);
			return rpe;
		}
	}
	
/*	public List<Map<String,Object>> getColumn(String sqlid) throws SQLException{
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("gridid", sqlid);
		
		//表格列的名称以及相关的数据
		List<Map<String,Object>> d = txSessionFactory.getTxSession().select("select * from tx_sys_grid_columns where gridid =${gridid}", sqlparame).getDatas();
		
		return null;
	}*/
	
	
	/**
	 * 下载资源文件
	 * @param re 
	 * @return
	 * @throws SQLException
	 * @throws TxInvokingException 
	 */
/*	public ResponseEntitys fnDownloadFile(RequestEntitys re) throws SQLException, TxInvokingException{
		JSONObject j = JSON.parseObject(re.getDatas());
		String sqlid = j.getString("sqlid");
		String parame= j.getString("parame");
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("id", sqlid);
		
		//表格内容的数据
		List<Map<String,Object>> r = txSessionFactory.getTxSession().select("select * from tx_sys_grid where id=${id}", sqlparame).getDatas();
		if(r.size() == 0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000006");
		}else {
			sqlparame.clear();
			sqlparame.put("gridid", sqlid);
			
			//表格列的名称以及相关的数据
			List<Map<String,Object>> d = txSessionFactory.getTxSession().select("select * from tx_sys_grid_columns where gridid =${gridid}", sqlparame).getDatas();
			
			
			
		}
		return null;
	}
	*/

	
	@SuppressWarnings("unchecked")
	public String getRealSQL(String sql,RequestEntitys re) {
		Map<String,Object> userinfo = (Map<String, Object>) re.getSession().getAttribute("USERINFO");
		Integer language = (Integer) userinfo.get("language");
		return SqlStringUtils.replaceAll(sql, "$${language}", ""+language);
	}
	/**
	 * 根据SQLID查询列的信息
	 * @param re
	 * @return
	 * @throws SQLException
	 */
	public ResponseEntitys fnGetTableColumns(RequestEntitys re) throws SQLException {
		ResponseEntitys rpe = new ResponseEntitys();
		JSONObject j = JSON.parseObject(re.getDatas());
		String sqlid = j.getString("sqlid");
		Map<String,Object> sqlparame = new HashMap<String,Object>();
		sqlparame.put("gridid", sqlid);
		List<Map<String,Object>> datas =txSessionFactory.getTxSession().select(getRealSQL("select s.*,e.label from tx_sys_grid_columns s  left join tx_base_language e on e.name = s.name  and e.languagecode=$${language} where gridid =${gridid}  order by s.serialnumber ",re), sqlparame).getDatas();
		rpe.setDatas(JSON.toJSONString(datas));
		return rpe;
	}
	
	/**
	 * 根据SQL生成字段信息
	 * @param re  
	 * @return
	 * @throws SQLException 
	 */
	public ResponseEntitys fnGenerateFieldInformation(RequestEntitys re) throws SQLException {
		JSONObject j = JSON.parseObject(re.getDatas());
		String sql =j.getString("sql");
		ResponseEntitys rpe = new ResponseEntitys();
		rpe.setDatas(JSON.toJSONString(txSessionFactory.getTxSession().selectPaging(getRealSQL(sql,re), null,0,1)));
		return rpe;
	}
	
	/**
	 * 用户退出登入
	 * @param re
	 * @return
	 */
	public ResponseEntitys fnOutLogin(RequestEntitys re) {
		re.getSession().removeAttribute("USERINFO");
		re.getSession().removeAttribute("USERROLEINFO");
		ResponseEntitys rsp = new ResponseEntitys();
		rsp.setMsg(ExtAjaxOfJsService.getLanguageHint("TX-000005"));
		return rsp;
	}
	
	public String getSQLMappingSymbol(String code) throws TxInvokingException {
		if(code == null || "".equals(code)) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000008");
		}else {
			if("0".equals(code)) {
				return " %s like ${%s} ";
			}else if("1".equals(code)) {
				return " %s not like ${%s} ";
			}else if("2".equals(code)) {
				return " %s =  ${%s} ";
			}else if("3".equals(code)) {
				return " %s >  ${%s} ";
			}else if("4".equals(code)) {
				return " %s >= ${%s} ";
			}else if("5".equals(code)) {
				return " %s < ${%s} ";
			}else if("6".equals(code)) {
				return " %s <= ${%s} ";
			}else if("7".equals(code)) {
				return " %s is null ";
			}else if("8".equals(code)) {
				return " %s is not null ";
			}else {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000007", code);
			}
		}
	}
	/**
	 * 标准分页的保存
	 * @param re
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnStandardPagingSave(RequestEntitys re) throws Exception {
		JSONObject j    = JSON.parseObject(re.getDatas());
		String action   = j.getString("action");
		String sqlid    = j.getString("sqlid");
		List<Map<String,Object>> jsonData = new ArrayList<Map<String,Object>>();;
		try {
			jsonData = JSON.parseObject(j.getString("jsonData"),new TypeReference<List<Map<String,Object>>>(){});
		} catch (Exception e) {
			jsonData.add( JSON.parseObject(j.getString("jsonData"),new TypeReference<Map<String,Object>>(){}));
		}
		
		Map<String,Object> sqlparames = new HashMap<String,Object>();
		sqlparames.put("id", sqlid);
		QuerySqlResult qsr = txSessionFactory.getTxSession().select(getRealSQL("select * from tx_sys_grid where id=${id}",re), sqlparames);
		List<Map<String,Object>> sqliddatas = qsr.getDatas();
		if(sqliddatas.size() == 0) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000006",sqlid);
		}else {
			Map<String,Object> sqldata = sqliddatas.get(0);
			if("create".equals(action)) { // 新增
				Object  fncreate = sqldata.get("fncreate");
				ResponseEntitys rpe = new ResponseEntitys();
				if(fncreate == null || "".equals(fncreate)) {
					int number = create(sqldata,jsonData);
					rpe.setDatas(""+number);
				}else {
					int number =create((String)fncreate,sqldata,jsonData);
					rpe.setDatas(""+number);
				}
				return rpe;
			}else if ("update".equals(action)) { //修改
				Object  fnupdate = sqldata.get("fnupdate");
				ResponseEntitys rpe = new ResponseEntitys();
				if(fnupdate == null || "".equals(fnupdate)) {
					int number = update(sqldata,jsonData);
					rpe.setDatas(""+number);
				}else {
					int number =update((String)fnupdate,sqldata,jsonData);
					rpe.setDatas(""+number);
				}
				return rpe;
				
			}else if ("destroy".equals(action)) { //删除
				Object  fndelete = sqldata.get("fndelete");
				ResponseEntitys rpe = new ResponseEntitys();
				if(fndelete == null || "".equals(fndelete)) {
					int number = destroy(sqldata,jsonData);
					rpe.setDatas(""+number);
				}else {
					int number =destroy((String)fndelete,sqldata,jsonData);
					rpe.setDatas(""+number);
				}
				return rpe;
			}else {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000010",action);
			}
		}
	}
	private int invoking(String path,Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, TxInvokingException, ClassNotFoundException {
		Map<String,String> resolve =ExtAjaxOfJsService.resolvePath(path);
		String type =resolve.get("type");
		String bean = resolve.get("bean");
		String method =resolve.get("method");
		if(CmdService.exist(type)) {
			if(type.equalsIgnoreCase(CmdService.java.getValue())) {
				@SuppressWarnings("rawtypes")
				Class clzz = Class.forName(bean);
				@SuppressWarnings("unchecked")
				Method m = clzz.getMethod(method, sqlid.getClass(),jsonData.getClass());
				return (Integer) m.invoke(null, sqlid,jsonData);
			}else if(type.equalsIgnoreCase(CmdService.javascript.getValue())) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
			}else if(type.equalsIgnoreCase(CmdService.spring.getValue())) {
				Object beans = SpringContextUtil.getApplicationContext().getBean(bean);
				Method m = beans.getClass().getMethod(method, sqlid.getClass(),jsonData.getClass());
				return (Integer) m.invoke(beans, sqlid,jsonData);
			}else {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
			}
		}else {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
		}
	}
	private int create(String path,Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, TxInvokingException, ClassNotFoundException {
		return invoking(path,sqlid,jsonData);
	}
	
	private int save(Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws SQLException {
		TxSession session = txSessionFactory.getTxSession();
		Transactional t =session.openTransactional();
		try {
			String singletablename = (String) sqlid.get("singletablename");
			int i =0;
			for(Map<String,Object> m : jsonData) {
				i+=session.save(singletablename, m);
			}
			t.commit();
			return i;
		}catch (SQLException e) {
			t.rollback();
			throw e;
		}
	}
	private int create(Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws SQLException {
		return save(sqlid,jsonData);
	}
	private int update(String path,Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException, TxInvokingException {
		return invoking(path,sqlid,jsonData);
	}
	private int update(Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws SQLException {
		return save(sqlid,jsonData);
	}
	private int destroy(String path,Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException, NoSuchMethodException, SecurityException, ClassNotFoundException, TxInvokingException {
		return invoking(path,sqlid,jsonData);
	}
	private int destroy(Map<String,Object> sqlid,List<Map<String,Object>> jsonData) throws Exception {
		String singletablename = (String) sqlid.get("singletablename");
		TxSession session = txSessionFactory.getTxSession();
		Transactional t =session.openTransactional();
		try {
			int i =0;
			for(Map<String,Object> m : jsonData) {
				if(m.get("id") == null) {
					throw TxInvokingException.throwTxInvokingExceptions("TX-000013");
				}
				i+=session.delete(singletablename, (String)m.get("id"));
				
			}
			t.commit();
			return i;
		} catch (Exception e) {
			t.rollback();
			throw e;
		}
		
	}
	
	/**
	 * 用户表格配置页面的保存方法
	 * @param re
	 * @return
	 * @throws Exception
	 */
	public ResponseEntitys fnSaveTableModelsConfig(RequestEntitys re) throws Exception{
		JSONObject j = JSON.parseObject(re.getDatas());
		if(j  == null) {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000011");
		}else {
			String tablename          = j.getString("name");
			Map<String,Object> datas  = JSON.parseObject(j.getString("datas"),new TypeReference<Map<String,Object>>(){});
			//datas.put("updatetime", StringUtils.getCurrentTimeDate());
			int i =txSessionFactory.getTxSession().save(tablename, datas);
			ResponseEntitys rpe = new ResponseEntitys();
			if(i!=0) {
				rpe.setMsg("更新数据成功!");
				rpe.setDatas(""+i);
				return rpe;
			}else {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000012");
			}
		}
	}
	/**
	 * 标准分页查询 
	 * @param re          
	 * @return
	 * @throws Exception
	 */
	public ResponseEntitys fnStandardPagingQuery(RequestEntitys re) throws Exception {
		ResponseEntitys rep = new ResponseEntitys();
		JSONObject j = JSON.parseObject(re.getDatas());
		String sqlid =j.getString("sqlid");
		JSONObject pagingParams = JSON.parseObject(j.getString("pagingParams"));
		Integer page  = pagingParams.getInteger("page");
		//Integer start = pagingParams.getInteger("pagingParams");
		Integer limit = pagingParams.getInteger("limit");
		String conditionName   =pagingParams.getString("conditionName");
		
		List<Map<String,Object>> and = JSON.parseObject(pagingParams.getString("and"),new TypeReference<List<Map<String,Object>>>(){});
		if(conditionName!=null && !"".equals(conditionName)) {
			if(!StringUtils.testIsEffectiveField(conditionName)) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000009");
			}
			String conditionValue  =pagingParams.getString("conditionValue");
			String conditionSymbol =getSQLMappingSymbol(pagingParams.getString("conditionSymbol"));
			String where = String.format(conditionSymbol, conditionName,conditionName);
			Map<String,Object> whereparames = new HashMap<String,Object>();
			
			if("0".equals(pagingParams.getString("conditionSymbol")) || "1".equals(pagingParams.getString("conditionSymbol"))) {
				whereparames.put(conditionName, "%"+conditionValue+"%");
			}else {
				whereparames.put(conditionName, conditionValue);
			}
			if(and!=null) {
				for(Map<String,Object> m : and) {
					if(!StringUtils.testIsEffectiveField((String)m.get("conditionName"))) {
						throw TxInvokingException.throwTxInvokingExceptions("TX-000009");
					}
					if("0".equals(m.get("conditionSymbol")) || "1".equals(m.get("conditionSymbol"))) {
						whereparames.put((String)m.get("conditionName"), "%"+m.get("conditionValue")+"%");
					}else {
						whereparames.put((String)m.get("conditionName"), m.get("conditionValue"));
					}
					where+=" and "+String.format(getSQLMappingSymbol((String)m.get("conditionSymbol")), m.get("conditionName"),m.get("conditionName"));
				}
			}
			Map<String,Object> sqlparames = new HashMap<String,Object>();
			sqlparames.put("id", sqlid);
			List<Map<String,Object>> sqllist = txSessionFactory.getTxSession().select(getRealSQL("select * from tx_sys_grid where id=${id}",re), sqlparames).getDatas();
			if(sqllist.size() == 0) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000006", sqlid);
			}else {
				Map<String,Object> result = sqllist.get(0);
				String sql      = (String) result.get("querysql");
				//String countsql = (String) result.get("countsql");
				Map<String,Object> d = new HashMap<String,Object>();
				List<Map<String,Object>> datas =txSessionFactory.getTxSession().selectPaging(getRealSQL(String.format("select * from (%s) as ______tables where %s ", sql,where),re), whereparames,limit,page).getDatas();
				Long count = (Long) txSessionFactory.getTxSession().select(getRealSQL(String.format("select count(1) count  from (%s) as ______tables where %s ", sql,where),re) , whereparames).getDatas().get(0).get("count");
				d.put("count", count);
				d.put("datas", datas);
				rep.setDatas(JSON.toJSONString(d));
				return rep;
			}
			
		}else {
			Map<String,Object> sqlparames = new HashMap<String,Object>();
			sqlparames.put("id", sqlid);
			List<Map<String,Object>> sqllist = txSessionFactory.getTxSession().select(getRealSQL("select * from tx_sys_grid where id=${id}",re), sqlparames).getDatas();
			if(sqllist.size() == 0) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000006", sqlid);
			}else {
				Map<String,Object> result = sqllist.get(0);
				String sql      = (String) result.get("querysql");
				String countsql = (String) result.get("countsql");
				Map<String,Object> d = new HashMap<String,Object>();
				List<Map<String,Object>> datas =txSessionFactory.getTxSession().selectPaging(getRealSQL(sql,re), null,limit,page).getDatas();
				Long count = (Long) txSessionFactory.getTxSession().select(getRealSQL(countsql,re), null).getDatas().get(0).get("count");
				d.put("count", count);
				d.put("datas", datas);
				rep.setDatas(JSON.toJSONString(d));
				return rep;
			}
		}
		
		
	}
	/**
	 * 获取当前维护的所有方言的key 和 value
	 * @param re
	 * @return
	 * @throws SQLException
	 */
	@SuppressWarnings("unchecked")
	public ResponseEntitys fnGetLanguageAll(RequestEntitys re) throws SQLException {
		ResponseEntitys rp = new ResponseEntitys();
		Map<String,Object> sqlparames=new HashMap<String,Object>();
		sqlparames.put("languagecode",((Map<String,Object>) re.getSession().getAttribute("USERINFO")).get("language"));
		QuerySqlResult rsr = txSessionFactory.getTxSession().select(getRealSQL("select * from tx_base_language where languagecode=${languagecode}",re), sqlparames);
		rp.setDatas(JSON.toJSONString(rsr.getDatas()));
		return rp;
	}
	
	/***
	 * 获取当前用户的session数据此数据包含用户基本信息和角色基本信息
	 * @param re  
	 * @return
	 */
	public ResponseEntitys fnGetUserAndGroupInfo(RequestEntitys re) {
		ResponseEntitys rpe = new ResponseEntitys();
		Map<String,Object> result = new HashMap<String,Object>();
		result.put("USERINFO", re.getSession().getAttribute("USERINFO"));
		result.put("USERROLEINFO", re.getSession().getAttribute("USERROLEINFO"));
		rpe.setDatas(JSON.toJSONString(result));
		return rpe;
	}
	
	/** 
	 * 当前登入用户的登入信息
	 * @param re  
	 * @return
	 * @throws Exception 
	 */
	public ResponseEntitys fnLoginSystem(RequestEntitys re) throws Exception {
		String txt = RSA.decode(re.getDatas());
		JSONObject json = JSON.parseObject(txt);
		String username = json.getString("username");
		String password = json.getString("password");
		Map<String,Object> sqlparames = new HashMap<String,Object>();
		sqlparames.put("username", username);
		sqlparames.put("password", StringUtils.md5(password).toLowerCase());
		QuerySqlResult result = txSessionFactory.getTxSession().select("select * from tx_base_user where username=${username} and password=${password}", sqlparames);
		if(result.getDatas().size() != 0) {
			ResponseEntitys rp = new ResponseEntitys();
			rp.setMsg(ExtAjaxOfJsService.getLanguageHint("TX-000004"));
			re.getSession().setAttribute("key_0", json.getString("key_0"));
			re.getSession().setAttribute("key_1", json.getString("key_1"));
			re.getSession().setAttribute("key_2", json.getString("key_2"));
			re.getSession().setAttribute("USERINFO", result.getDatas().get(0));
			re.getSession().setMaxInactiveInterval((Integer)result.getDatas().get(0).get("session_valid"));
			sqlparames.clear();
			sqlparames.put("userid", result.getDatas().get(0).get("id"));
			QuerySqlResult r = txSessionFactory.getTxSession().select("select e.*  from tx_base_role_mapping g left join  tx_base_role e  on g.roleid = e.id  where g.userid =${userid}", sqlparames);
			re.getSession().setAttribute("USERROLEINFO", r.getDatas().get(0));
			return rp;
		}else {
			throw TxInvokingException.throwTxInvokingExceptions("TX-000003");
		}
	}
	
	/**
	 * 获取当前系统的菜单节点
	 * @param re
	 * @return
	 * @throws SQLException 
	 */
	public ResponseEntitys getTxSysMenu(RequestEntitys re) throws SQLException {
		String datas = re.getDatas();
		JSONObject object =JSON.parseObject(datas);
		String father = object.getString("father");
		String permissions = object.getString("permissions"); 
		Map<String,Object> sqlparames = new HashMap<String,Object>();
		sqlparames.put("father", father);
		QuerySqlResult r  = null;
		if(!"0".equals(permissions)) {
			sqlparames.put("roleid", re.getRoleId());
			r = txSessionFactory.getTxSession().select(getRealSQL("select u.* from tx_sys_menu_authorization n left join tx_sys_menu u on n.menuid = u.id where n.roleid =${roleid} and u.father =${father} and n.state = '0' order by u.sorting ",re), sqlparames);
		}else {
			r = txSessionFactory.getTxSession().select(getRealSQL("select * from  tx_sys_menu where  father =${father} order by sorting ",re), sqlparames);
		}
		ResponseEntitys rep = new ResponseEntitys();
		rep.setDatas(JSON.toJSONString(r));
		return rep;
	}
	/**
	 * 获取公钥
	 * @param re
	 * @return
	 */
	public ResponseEntitys getPublicKey(RequestEntitys re) {
		ResponseEntitys rp = new ResponseEntitys();
		rp.setDatas(RSA.getPublicKey());
		return rp;
	}
}

