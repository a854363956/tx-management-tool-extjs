package tx.management.tool.extjs.route.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



import tx.database.common.utils.string.SqlStringUtils;
import tx.management.tool.extjs.utils.StringUtils;


public class ExtJsAnnotationService extends HttpServlet{
	private static final long serialVersionUID = -3174482034482972232L;
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
}
