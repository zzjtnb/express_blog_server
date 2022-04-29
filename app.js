const express = require('express');
const app = express()
const host = 'localhost'
const port = process.env.PORT || 5000
const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true //需明确设置
}));
const { httpLogger, httpErrorLogger, appLog } = require('./middleware/log4');
app.use(httpLogger)
/**
 * 静态资源中间件-设定静态文件目录.
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
/**
 * 设置跨域访问
 */
// const cors = require('cors');
// app.use(cors());
// CORS解决跨域问题
app.all('*', (req, res, next) => {
  //设置允许跨域的域名，*代表允许任意域名跨域.例如 允许百度跨域， 把下面这行的*替换为 https://baidu.com
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  if (req.method.toLowerCase() == 'options') res.sendStatus(200);  //让options预验证尝试请求快速结束
  else next();
});
/**
 * 路由
 */
const route = require('./routers/index')
app.use(route);//把路由容器挂载到 app 服务中
/**
 * Api
 */
const api = require('./api/index')
app.use('/api/v1', api)
/**
 * 配置一个处理404的中间件
 */
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//注意：上面代码一定要放在所有路由中间件之后，原理就是当前面没有任何一个路由可以处理的时候，程序就会走到最后这个中间件，然后就可以当作 404 来处理了。
/**
 * 配置一个全局错误处理中间件
 */
// development error handler-开发错误处理程序
// will print stacktrace-将输出stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    httpErrorLogger.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.json({ err_code: err.status || 500, message: err.message })
  });
} else {
  // production error handler-生产错误处理程序
  // no stacktraces leaked to user-没有堆栈跟踪泄露给用户
  app.use((err, req, res, next) => {
    httpErrorLogger.error("Something went wrong:", err);
    res.status(err.status || 500);
    res.json({ err_code: err.status || 500, message: err.message })
  });
}
app.listen(port, host, () =>
  // console.log('\033[42;30m DONE \033[40;32m  app runing on http://%s:%s \033[0m', host, port)
  appLog.info(`Server listening on http://${host}:${port}`)
)

