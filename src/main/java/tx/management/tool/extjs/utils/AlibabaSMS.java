package tx.management.tool.extjs.utils;

import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.exceptions.ServerException;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
/**
 * 阿里云发送短信接口
 * @author 张尽
 * @email  zhangjin0908@hotmail.com
 * @qq     854363956
 * @date 2017年11月28日 上午11:48:13
 */
public class AlibabaSMS {
	final private String product = "Dysmsapi";
	final private String domain  = "dysmsapi.aliyuncs.com";
	private IAcsClient acsClient; 
	public AlibabaSMS(String accessKeyId,String accessKeySecret) throws ClientException {
		System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
		System.setProperty("sun.net.client.defaultReadTimeout", "10000");
		IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId,accessKeySecret);
		DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
	    acsClient = new DefaultAcsClient(profile);
	}
	/**
	 * 如果返回true表示表示发送成功,如果返回false表示发送失败
	 * @param autograph      短信签名
	 * @param phoneNumbers   要发送的手机号码
	 * @param templateCode   模版编号
	 * @param datas          模版数据
	 * @return
	 * @throws ServerException
	 * @throws ClientException
	 */
	public boolean fnSendMessage(String autograph,String phoneNumbers, String templateCode,Map<String,String> datas) throws ServerException, ClientException {
		SendSmsRequest request = new SendSmsRequest();
		request.setMethod(MethodType.POST);
		request.setPhoneNumbers(phoneNumbers);
		request.setSignName(autograph);
		request.setTemplateCode(templateCode);
		request.setTemplateParam(JSON.toJSONString(datas));
		SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);
		if(sendSmsResponse.getCode() != null && sendSmsResponse.getCode().equals("OK")) {
			return true;
		}else {
			return false;
		}
	}
}
