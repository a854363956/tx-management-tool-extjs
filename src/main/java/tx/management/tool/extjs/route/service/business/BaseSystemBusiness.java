package tx.management.tool.extjs.route.service.business;

import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;

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
			sqlparame.put("id", UUID.randomUUID().toString().replaceAll("-", ""));
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
				return (int) m.invoke(null, sqlid,jsonData);
			}else if(type.equalsIgnoreCase(CmdService.javascript.getValue())) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000002");
			}else if(type.equalsIgnoreCase(CmdService.spring.getValue())) {
				Object beans = SpringContextUtil.getApplicationContext().getBean(bean);
				Method m = beans.getClass().getMethod(method, sqlid.getClass(),jsonData.getClass());
				return (int) m.invoke(beans, sqlid,jsonData);
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
			re.getSession().setMaxInactiveInterval((int)result.getDatas().get(0).get("session_valid"));
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
		Map<String,Object> sqlparames = new HashMap<String,Object>();
		sqlparames.put("father", father);
		sqlparames.put("roleid", re.getRoleId());
		QuerySqlResult r = txSessionFactory.getTxSession().select(getRealSQL("select u.* from tx_sys_menu_authorization n left join tx_sys_menu u on n.menuid = u.id where n.roleid =${roleid} and u.father =${father}",re), sqlparames);
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

