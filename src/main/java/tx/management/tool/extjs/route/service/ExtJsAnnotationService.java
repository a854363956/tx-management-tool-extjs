package tx.management.tool.extjs.route.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import tx.database.common.utils.string.SqlStringUtils;
import tx.management.tool.extjs.route.service.business.BaseSystemBusiness;
import tx.management.tool.extjs.route.service.entitys.RequestEntitys;
import tx.management.tool.extjs.route.service.entitys.ResponseEntitys;
import tx.management.tool.extjs.utils.JsAnnotationUtils;
import tx.management.tool.extjs.utils.SpringContextUtil;
import tx.management.tool.extjs.utils.StringUtils;


public class ExtJsAnnotationService extends HttpServlet{
	private static final long serialVersionUID = -3174482034482972232L;
	private static ServletConfig config;
	@Override
	protected void doHead(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}

	@Override
	protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}

	@Override
	protected void doTrace(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.sendError(HttpServletResponse.SC_FORBIDDEN);
		return;
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String path = req.getRequestURI();
		OutputStream   os = resp.getOutputStream();
		List<String> p =SqlStringUtils.findRegex(path, "component.+");
		String file = req.getSession().getServletContext().getRealPath("/")+ p.get(0);
		File f = new File(file);
		if(!f.exists()) {
			resp.sendError(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		FileInputStream fis =new FileInputStream(f);
		try {
			byte[] bytes = StringUtils.readInputStreamByte(fis);
			bytes=addGridAnnotation(bytes,req.getSession());
			os.write(bytes);
			return;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			fis.close();
			os.flush();
			os.close();
		}
	}
	/**
	 * 添加Grid注解
	 * @param bytes
	 * @return
	 * @throws Exception
	 */
	private byte[] addGridAnnotation(byte[] bytes,HttpSession session) throws Exception {
		String text = new String(bytes);
		JsAnnotationUtils js = new JsAnnotationUtils(text);
		List<String> grids =js.findGridAnnotation();
		String templates = js.readTemplatesDatas("grid-template.js");
		for(String grid : grids) {
			String sqlid    = js.findGridAnnotationSqlid(grid);
			templates = templates.replaceAll("\\$\\{sqlid\\}", sqlid);
			BaseSystemBusiness bsb = SpringContextUtil.getApplicationContext().getBean(BaseSystemBusiness.class);
			RequestEntitys rpe = new RequestEntitys();
			Map<String,String> map = new HashMap<String,String>();
			map.put("sqlid", sqlid);
			rpe.setDatas(JSON.toJSONString(map));
			rpe.setSession(session);
			ResponseEntitys rp = bsb.fnGetTableColumns(rpe);
			templates = templates.replaceAll("\\$\\{datas\\}", rp.getDatas());
			String name = js.findGridVarName(grid);
			String realgrid = js.getRealGridData(name, templates);
			text = text.replace(grid, realgrid);
		}
		return text.getBytes();
	}
	@Override
	public void init(ServletConfig config) throws ServletException {
		this.config = config;
	}
	public static String readAnnontitionFile(String filename) throws IOException {
		String path = config.getServletContext().getResource("/WEB-INF/classes/tx/management/tool/extjs/configs/resources/templates/js/"+filename).getPath();
		File f = new File(path);
		FileInputStream fis =new FileInputStream(f);
		try {
			byte[] bytes = StringUtils.readInputStreamByte(fis);
			return new String(bytes);
		} finally {
			if(fis!=null) {
				fis.close();
			}
		}
	}
	
}
