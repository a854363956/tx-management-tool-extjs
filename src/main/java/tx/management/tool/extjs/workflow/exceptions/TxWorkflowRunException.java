package tx.management.tool.extjs.workflow.exceptions;

/**
 * 当用户抛出此异常的时候进入流程异常状态的控制器
 * @author 张尽
 * @email  zhangjin0908@hotmail.com
 * @qq     854363956
 * @date 2017年11月27日 下午4:59:42
 */
public class TxWorkflowRunException extends RuntimeException{
	private int code=0;
	
	private static final long serialVersionUID = -1754384078851574210L;
	
	public TxWorkflowRunException(int code) {
		this.code = code;
	}
	
	public int getCode() {
		return this.code;
	}
	
}
