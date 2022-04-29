const { Sequelize, DataTypes, sequelize } = require('../dao/db')
const Test = sequelize.define('tests', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  created: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
},
  {
    timestamps: false
  }
)
// const log4js = require("log4js");
// const logger = log4js.getLogger();
// Test.sync().then(() => {
//   logger.info('tests表已同步');
// })
// Test.sync({ force: true }) //force: true数据库存在同名表则删除重新创建

module.exports = Test