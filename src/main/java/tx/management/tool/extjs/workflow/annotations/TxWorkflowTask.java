package tx.management.tool.extjs.workflow.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface TxWorkflowTask {
	/**
	 * 状态,当前接受的请求状态
	 * @return
	 */
	public int status();
}
