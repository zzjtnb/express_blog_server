const log = require('../middleware/log4');
const db = {
  zzjtnb: {
    dialect: 'mysql', //数据库类型
    charset: 'utf8mb4', //字符集
    collate: 'utf8mb4_general_ci', //排序规则
    host: 'localhost', //地址
    port: 3306, //端口
    username: 'root', //用户名
    password: 'root', //密码
    database: 'nodesql', //数据库名称
    timezone: '+08:00',
    define: {
      // create_time && update_time
      timestamps: false,
      pool: {
        max: 5,
        min: 0,
        idle: 1000, //最长空置时间（毫秒），超时后释放连接
        acquire: 3000, //连接池尝试连接最长时间（毫秒），超过抛出异常
      },
    },
    //如果选择log.logger.info,会有Cannot read property 'isLevelEnabled' of null的异常。
    logging: log.info,
  },
};
module.exports = db;
