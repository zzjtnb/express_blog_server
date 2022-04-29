# Node+MySql构建登录注册接口

## 一.快速生成package.json
```js
npm init --yes
```

## 二.安装模块

- 安装nodemon
>项目中安装
```js
npm i nodemon
```

>全局安装(nodemon建议全局安装)
```js
npm i nodemon 
```
- 安装express
```js
npm i express 
```
- 安装Sequelize     使用对象方式对数据库进行操作
```js
npm i sequelize 
```
- 安装Sequelize-Automate
```js
npm install  sequelize-automate
//package.json

//"scripts": {
// "automate": "sequelize-automate -c config/automate.js"
//}

// npm run automate
```
- 安装mysql2        对MySql操作
```js
npm install mysql2 
```
- 安装body-parser   解决POST请求传过来的数据
```js
npm i body-parser 
```
- 安装bcryptjs      加密解密密码
```js
npm i bcryptjs 
```
- 安装jsonwebtoken  认证
```js
npm i jsonwebtoken 
```
- 安装EJS  映射渲染html
```js
npm i ejs 
```
- 安装log4js  日志管理
```js
npm install log4js
```
- 安装汉字拼音转换工具
```js
npm i cnchar
```


以上依赖一句话安装
```js
npm i nodemon express sequelize mysql2 body-parser bcryptjs jsonwebtoken ejs -S
```
以上为开发时的过程

## 三. 使用

- 安装依赖
```js
npm install
```
- 运行
```js
npm run dev
```
## 三.数据库
- 打开数据库创建数据库名nodesql
- 在数据库名nodesql右键运行SQL文件
  
## 四.项目目录
- api       负责接口管理
- config    数据库配置文件
- dao       数据库持久化
- database  储存静态数据
- model   模型管理、数据操作
- public    存放资源文件
- routers   管理路由
- utils     管理各类工具
- views     视图层


netstat -ap | grep 5000
lsof -i:8888
kill -9 PID号