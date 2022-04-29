/**
pm2 部署 nuxt 项目
参看文档:https://nuxtjs.org/faq/deployment-pm2
pm2配置文档:https://pm2.keymetrics.io/docs/usage/application-declaration/
对于新装的pm2 一定要记得执行下 `pm2 kill` 清一下旧的pm2进程
运行指令:
pm2 start <pm2配置文件名> --env <环境变量>
*/
module.exports = {
  apps: [
    {
      // pm项目名
      name: 'api',
      // 当前工作路径
      cwd: './',
      // 启动文件地址
      script: './app.js',
      // 启动参数 执行的指令名 exp: package script 'start': 'nuxt start'
      // 包含通过 CLI 传递给脚本的所有参数的字符串
      // 这个就会去执行 package.json 中的start方法
      args: 'start:prod',
      // 启用监视和重启功能,如果文件夹或子文件夹中的文件发生更改,您的应用将重新加载
      watch: true,
      // 监控时延迟1秒
      watch_delay: 1000,
      // 忽视这些目录的变化
      ignore_watch: ['node_modules', 'logs', 'public'],
      // 自动重启
      autorestart: true,
      // 在重新启动崩溃的应用程序之前等待的时间(以毫秒为单位)
      restart_delay: 4000,
      // 应用程序的最小正常运行时间被视为已启动
      min_uptime: '60s',
      // node的启动模式
      // node_args: '--insecure-http-parser',
      // pm2 start pm.config.js
      env: {
        // 当前环境变量
        NODE_ENV: 'production',
        PORT: 5000,
      },
      // pm2 start pm.config.js --env production
      env_production: {
        // 设置运行环境,将出现在您的应用程序中的环境变量
        // process.env.production
        NODE_ENV: 'production',
        // 启动端口
        PORT: 5000,
      },
      // pm2 start pm.config.js --env development
      env_development: {
        // 设置运行环境，此时process.env.NODE_ENV的值就是development
        NODE_ENV: 'development',
        // 启动端口
        PORT: 5000,
      },
      out_file: './logs/pm2/out.log', // 普通日志路径
      error_file: './logs/pm2/err.log', // 错误日志路径
      merge_logs: false,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
