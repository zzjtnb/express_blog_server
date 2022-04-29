/**
 * 连接到数据库
 */
const { Sequelize, DataTypes } = require('sequelize');
const dbcfg = require('../config/db')
// 分别传递参数 (其它数据库)
// const sequelize = new Sequelize(dbcfg.test1.database, dbcfg.test1.username, dbcfg.test1.password, dbcfg.test1.options);
const sequelize = new Sequelize(dbcfg.zzjtnb);
const { consoleout } = require('../middleware/log4');
//测试连接
sequelize.authenticate()
  .then(() => {
    consoleout.info('MySql Connection has been established successfully.');
    sequelize.sync();
    consoleout.info("所有模型均已成功同步.");
  })
  .catch(err => {
    consoleout.error('Unable to connect to the database:', err);
  });


module.exports = { Sequelize, DataTypes, sequelize }