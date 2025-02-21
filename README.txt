由于需要安装JS运行时环境以及相关外部模块，所以本实验只提供源码，使用方法如下

index.html是实验的可视化页面部分，你将在此页面下进行数据交互

后端部分的使用：
	确保使用之前安装了node.js和npm包管理器
	在此项目的revSystem下通过命令行安装以下模块
		npm install express mysql body-parser
	express框架用于构建web服务器
	mysql模块用于实现数据库交互
	body-parser用于解析请求体

	以上完成之后，运行以下命令启动服务器
	node demo.js
	服务器启动之后，就可以监听前端请求