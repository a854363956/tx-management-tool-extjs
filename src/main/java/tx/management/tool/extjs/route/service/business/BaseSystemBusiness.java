package tx.management.tool.extjs.route.service.business;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import tx.database.common.utils.TxSessionFactory;
import tx.database.common.utils.entitys.QuerySqlResult;
import tx.database.common.utils.string.SqlStringUtils;
import tx.management.tool.extjs.exceptions.TxInvokingException;
import tx.management.tool.extjs.route.service.ExtAjaxOfJsService;
import tx.management.tool.extjs.route.service.entitys.RequestEntitys;
import tx.management.tool.extjs.route.service.entitys.ResponseEntitys;
import tx.management.tool.extjs.utils.RSA;
import tx.management.tool.extjs.utils.StringUtils;

@Controller
public class BaseSystemBusiness {
	@Resource(name="TxSessionFactory")
	private TxSessionFactory txSessionFactory;
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
			List<Map<String,Object>> sqllist = txSessionFactory.getTxSession().select("select * from tx_sys_grid where id=${id}", sqlparames).getDatas();
			if(sqllist.size() == 0) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000006", sqlid);
			}else {
				Map<String,Object> result = sqllist.get(0);
				String sql      = (String) result.get("querysql");
				String countsql = (String) result.get("countsql");
				Map<String,Object> d = new HashMap<String,Object>();
				List<Map<String,Object>> datas =txSessionFactory.getTxSession().selectPaging(String.format("select * from (%s) as ______tables where %s ", sql,where), whereparames,limit,page).getDatas();
				Long count = (Long) txSessionFactory.getTxSession().select(String.format("%s where %s", countsql,where) , whereparames).getDatas().get(0).get("count");
				d.put("count", count);
				d.put("datas", datas);
				rep.setDatas(JSON.toJSONString(d));
				return rep;
			}
			
		}else {
			Map<String,Object> sqlparames = new HashMap<String,Object>();
			sqlparames.put("id", sqlid);
			List<Map<String,Object>> sqllist = txSessionFactory.getTxSession().select("select * from tx_sys_grid where id=${id}", sqlparames).getDatas();
			if(sqllist.size() == 0) {
				throw TxInvokingException.throwTxInvokingExceptions("TX-000006", sqlid);
			}else {
				Map<String,Object> result = sqllist.get(0);
				String sql      = (String) result.get("querysql");
				String countsql = (String) result.get("countsql");
				Map<String,Object> d = new HashMap<String,Object>();
				List<Map<String,Object>> datas =txSessionFactory.getTxSession().selectPaging(sql, null,limit,page).getDatas();
				Long count = (Long) txSessionFactory.getTxSession().select(countsql, null).getDatas().get(0).get("count");
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
		QuerySqlResult rsr = txSessionFactory.getTxSession().select("select * from tx_base_language where languagecode=${languagecode}", sqlparames);
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
		QuerySqlResult r = txSessionFactory.getTxSession().select("select u.* from tx_sys_menu_authorization n left join tx_sys_menu u on n.menuid = u.id where n.roleid =${roleid} and u.father =${father}", sqlparames);
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

