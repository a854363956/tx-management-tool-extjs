package tx.management.tool.extjs.exceptions;

import tx.management.tool.extjs.route.service.ExtAjaxOfJsService;

/**
 * 使用ExtAjaxOfJsService调用方法出错的时候会调用此方法
 * @author 张尽
 * @email  zhangjin0908@hotmail.com
 * @qq     854363956
 * @date 2017年10月23日 上午9:24:42
 */
public class TxInvokingException extends Exception{
	private static final long serialVersionUID = -8300562975982351617L;
	protected TxInvokingException(String msg) {
		super(msg);
	}
	public static TxInvokingException throwTxInvokingExceptions(String msg,String... parames) {
		String msgs = ExtAjaxOfJsService.getLanguageHint(msg);
		return new TxInvokingException(msg+"->"+String.format(msgs, parames));
	}

}
