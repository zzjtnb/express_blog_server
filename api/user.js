/**
 * user 登录注册接口
 */
const express = require('express');
const user = express.Router();
const moment = require('moment');
moment.locale('zh-cn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
process.env.SECRET_KEY = 'zzjtnb'; //定义到环境变量
const userModule = require('../models/users');
//http://localhost:3000/api/v1/user/test
user.get('/user/test', (req, res) => {
	res.status(200).json({ msg: '用户测试接口' });
});
user.post('/user/login', async (req, res) => {
	const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	userModule.update({ loginTime: now }, { where: { email: req.body.email } });
	const model = await userModule.findOne({ where: { email: req.body.email } }); //得到数据去表里查
	if (!model) return res.status(404).json({ msg: '用户不存在' });
	const passwordVoid = bcrypt.compareSync(req.body.password, model.dataValues.password); //密码匹配
	if (!passwordVoid) return res.status(404).json({ msg: '密码错误' });
	let time = Math.floor(Date.now() / 1000) + 60 * 60; //生成token
	let token = jwt.sign({ name: model.dataValues.name }, process.env.SECRET_KEY, { expiresIn: time });
	//https://jwt.io    解析token
	userModule.update({ access_token: token }, { where: { email: req.body.email } });
	res.status(200).json({ token: token });
	// res.status(200).json({ msg: '登录成功' })
});
user.post('/user/auth', async (req, res) => {
	const token = req.headers.authorization.split(' ').pop();
	if (!token) return res.status(404).json({ msg: '请传入token' });
	const verify = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
		if (err) return res.status(404).json({ msg: 'token已过期' });
		return decoded.name;
	});
	const model = await userModule.findOne({ where: { name: verify } }); //得到数据去表里查
	if (!model) return res.status(404).json({ msg: 'token与当前用户不符' });
	res.status(200).json({ msg: '权限校验成功' });
});
user.post('/user/register', async (req, res) => {
	const model = await userModule.findOne({ where: { email: req.body.email } }); // 存之前先找
	if (model) return res.status(404).json({ msg: '该用户已存在' });
	let userData = req.body;
	const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	userData.created = now;
	userData.password = bcrypt.hashSync(req.body.password); //加密密码
	const result = await userModule.create(userData);
	if (result) return res.status(200).json({ data: result.email + '注册成功' });
});
module.exports = user;
