package tx.management.tool.extjs.utils;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
/**
 * 
 * @author 张尽
 * @date  2017年7月6日 下午2:12:58
 * @email zhangjin0908@hotmail.com
 * @qq 854363956
 *
 */
public class SpringContextUtil implements ApplicationContextAware  {
	private static ApplicationContext applicationContext;
	
	@Override
	public void setApplicationContext(ApplicationContext arg0)throws BeansException {
		SpringContextUtil.applicationContext=arg0;
	}
	
	/**
	 * 获得Spring的上下文
	 * @return applicationContext
	 */
	public static  ApplicationContext getApplicationContext(){
		return applicationContext;
	}
	/**
	 * 获取Spring中所有的Bean对象
	 * @return 返回获取到的Bean对象
	 */
	public static List<Object> getAllBean(){
		List<Object> result = new ArrayList<Object>();
		String[] beanNames = applicationContext.getBeanDefinitionNames();
		for(String name : beanNames) {
			result.add(applicationContext.getBean(name));
		}
		return result;
	}

}

