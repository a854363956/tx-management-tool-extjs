package tx.management.tool.extjs.utils;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class EMailUtils {
	private String emailAccount;
	private String emailPassword;
	private Properties props;
	public EMailUtils(String emailAccount,String  emailPassword,String emailSMTHost,String port) {
		fnUpdateEMailInfo(emailAccount,emailPassword,emailSMTHost,port);
	}
	/**
	 * 修改邮件内容
	 * @param emailAccount
	 * @param emailPassword
	 * @param emailSMTHost
	 * @param port
	 */
	public void fnUpdateEMailInfo(String emailAccount,String  emailPassword,String emailSMTHost,String port) {
		this.emailAccount  =  emailAccount;
		this.emailPassword =  emailPassword;
	    props = new Properties();                    // 参数配置
        props.setProperty("mail.transport.protocol", "smtp");   // 使用的协议（JavaMail规范要求）
        props.setProperty("mail.smtp.host", emailSMTHost);   // 发件人的邮箱的 SMTP 服务器地址
        props.put("mail.smtp.port", port);  
        props.setProperty("mail.smtp.auth", "true");            // 需要请求认证
	}
	
	/**
	 * 发送邮件
	 * @param myMailName         发送者的邮箱地址
	 * @param myName             发送者的名称
	 * @param receiveName        接受者的名称
	 * @param receiveMailAccount 接受者的邮箱地址
	 * @param subject            标题
	 * @param content            邮件内容
	 * @return                   发送成功,返回true
	 * @throws UnsupportedEncodingException
	 * @throws MessagingException
	 */
	public boolean fnSendEmailHtml(String myMailName ,String myName,String receiveName,String receiveMailAccount,String subject,String content) throws UnsupportedEncodingException, MessagingException {
		Transport transport = null;
		try {
			Session session = Session.getInstance(props);
	        MimeMessage message = new MimeMessage(session);
	        message.setFrom(new InternetAddress(myMailName, myName, "UTF-8"));
	        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(receiveMailAccount,receiveName, "UTF-8"));
	        message.setSubject(subject, "UTF-8");
	        message.setContent(content, "text/html;charset=UTF-8");
	        message.setSentDate(new Date());
	        message.saveChanges();
	        transport = session.getTransport();
	        transport.connect(emailAccount, emailPassword);
	        transport.sendMessage(message, message.getAllRecipients());
	        return true;
		} finally {
			if(transport!=null) {
				transport.close();
			}
		}
	}
}
