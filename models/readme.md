# 自动生成的需要注意三点
## 长文本类型(longtext)
```bash
DataTypes.TEXT('long')
```
## 时间类型(datetime)
```js
created: {
  type: Sequelize.DATE,
  get() {
    return moment(this.getDataValue('created')).format('YYYY-MM-DD HH:mm:ss');
  },
},
```
## 布尔值(tinyint)

```bash
DataTypes.BOOLEAN
#或者
DataTypes.INTEGER(1),
```