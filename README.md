# tx-management-tool-extjs GPL协议
##### 1.目录架构
StaticWebContent</br>
  - component #当前组件的目录</br>
  &nbsp;&nbsp;- extjs #此处表示Extjs所需要js文件</br>
  &nbsp;&nbsp;- libs  #此处表示三方库引入的文件</br>
  &nbsp;&nbsp;- pags  #此文件夹里面包含了所有的页面</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- _business  #建议在此目录下编写自己的逻辑</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- authorized #权限模块的页面在此处</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- development #在线开发的模块在此处</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- home #当前首页的模块在此处</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- logs #系统日志文件所在路径</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- prints #打印页面管理的模块路径</br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- system #系统基本参数维护的页面</br>

##### 2. 系统自定义控件
1. 表格
2. 字符操作
3. 窗口对象
4. 打印对象
5. 网络请求
6. 编辑器
7. 消息提示框

##### 3. 系统工具类
1. SMS短信
2. EMail邮件
3. 字符串操作
4. Excel操作
5. bean操作

##### 4. 注意事项
后台代码:</br>
假如您要编写后台代码,如果发生后台异常,并且要抛出到服务以外那么您需要这样使用代码</br>
`
 //第一个参数是编号在EN-US.properties 和 ZH-CN.properties 里面维护的信息,第二个是替换符号,会自动替换字符串中%s的字符,按照他的出现顺序
 throw TxInvokingException.throwTxInvokingExceptions("TX-000002"); 
`
