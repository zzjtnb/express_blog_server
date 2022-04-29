const { DataTypes } = require('sequelize');
const moment = require('moment')
moment.locale('zh-cn');
module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "path"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "title"
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "thumbnail"
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "description"
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "source"
    },
    vidID: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "vidID"
    },
    cidID: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "cidID"
    },
    hot: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "hot"
    },
    pageviews: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "pageviews"
    },
    created: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
      },
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "created"
    },
    updated: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
      },
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updated"
    }
  };
  const options = {
    tableName: "videos",
    comment: "",
    indexes: []
  };
  const VideosModel = sequelize.define("videos_model", attributes, options);
  return VideosModel;
};