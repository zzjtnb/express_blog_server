const { Sequelize, DataTypes, sequelize } = require('../dao/db')
module.exports = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER(255),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    comment: null,
    field: "id"
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: "",
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "name"
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: "",
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "password"
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: "",
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "email"
  },
  created: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "created"
  },
  loginTime: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "loginTime"
  },
  access_token: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "access_token"
  }
},
  {
    timestamps: false
  }
)