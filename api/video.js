/**
 * 视频接口
 */
const express = require('express');
const video = express.Router();
const jwt = require('jsonwebtoken');
const { sequelize } = require('../dao/db')
const VideosModel = require('../models/videos'); // 导入用户的模型
const videoModule = VideosModel(sequelize);
// 请保证最先引入 cnchar 基础库，其他几个库顺序无所谓
const cnchar = require('cnchar');
const md = require('markdown-it')('commonmark');
const moment = require('moment')
moment.locale('zh-cn');
//http://localhost:3000/api/v1/video/test
video.get('/video/test', (req, res) => {
  res.status(200).json({ msg: "视频测试接口" });
});
video.post('/video/add', async (req, res) => {
  console.log(req.body);
  if (!req.body.title) return res.status(404).json({ msg: "请输入标题" })
  const token = req.headers.authorization.split(" ").pop()
  if (!req.headers.authorization) return res.status(404).json({ msg: '请登录后操作' })
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({ msg: "登录信息已过期,请重新登陆后重试" })
  });
  req.body.created = req.body.created || new Date()
  const model = await videoModule.findOne({ where: { title: req.body.title } })
  if (model) return res.status(404).json({ msg: "存在同名视频" })
  req.body.path = req.body.title.spell('first').toLowerCase().replace(/\W/g, ""); //匹配一个非单字字符。等价于 [^A-Za-z0-9_]。

  const result = await videoModule.create(req.body)
  if (!result) return res.status(404).json({ msg: '保存失败' });
  res.status(200).json({ msg: "保存成功" })
});
video.delete('/video/delete', async (req, res) => {
  if (!req.query.path) return res.status(404).json({ msg: '请输入视频路径' })
  const token = req.headers.authorization.split(" ").pop()
  if (!req.headers.authorization) return res.status(404).json({ msg: '请登录后操作' })
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({ msg: "登录信息已过期,请重新登陆后重试" })
  });
  const model = await videoModule.findOne({ where: { path: req.query.path } })
  if (!model) return res.status(404).json({ msg: '该视频不存在' })
  const result = await videoModule.destroy({ 'where': { 'path': req.query.path } })
  if (!result) return res.status(404).json({ msg: '删除失败' });
  res.status(200).json({ msg: '删除成功' });
});
video.put('/video/edit', async (req, res) => {
  let oldPath = req.body.path
  const token = req.headers.authorization.split(" ").pop()
  if (!req.headers.authorization) return res.status(404).json({ msg: '请登录后操作' })
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({ msg: "登录信息已过期,请重新登陆后重试" })
  });
  const model = await videoModule.findOne({ where: { path: oldPath } })
  if (!model) return res.status(404).json({ msg: '该视频不存在' })
  req.body.path = req.body.title.spell('first').toLowerCase().replace(/\W/g, ""); //匹配一个非单字字符。等价于 [^A-Za-z0-9_]。
  req.body.updated = new Date()
  videoModule.update(req.body, { 'where': { path: oldPath } }).then((result) => {
    res.status(200).json({ msg: '编辑成功' });
  }).catch((err) => {
    res.status(404).json({ msg: '编辑失败,请稍后重试' })
  });
})
/**
 * 所有列表
 */
video.get('/video/list', async (req, res) => {
  let page = 0
  let per_page = 17
  if (req.query.page) {
    if ((Number(req.query.page) - 1) < 0) return res.status(404).json({ error: '查询参数错误' })
    page = Number(req.query.page) - 1
    per_page = Number(req.query.per_page)
  }
  const model = await videoModule.findAndCountAll({ order: [['created', req.query.order || 'desc']], limit: per_page, offset: page * per_page })
  if (!model) return res.status(404).json({ msg: '查询错误请稍后再试' })
  model.rows.map((item, index) => {
    model.rows[index].description = md.render(item.description).replace(/(<[^>]+>)|\\n/ig, '').substring(0, 200)
  })
  res.status(200).json(model)
})
/**
 * 单个详情
 */
video.get('/video/details', async (req, res) => {
  if (!req.query.path) return res.status(404).json({ msg: '请传入博客路径' })
  const model = await videoModule.findOne({ where: { path: req.query.path } })
  if (!model) return res.status(404).json({ msg: '该博客不存在' })
  videoModule.update({ pageviews: model.dataValues.pageviews + 1 }, { where: { path: req.query.path } })
  model.dataValues.pageviews = model.dataValues.pageviews + 1
  if (model.dataValues.created) model.dataValues.created = moment(model.dataValues.created).format('YYYY-MM-DD HH:mm:ss');
  if (model.dataValues.updated) model.dataValues.updated = moment(model.dataValues.updated).format('YYYY-MM-DD HH:mm:ss');
  // JS数组转字符串
  // let a = ['a', 'b']
  // a = a.join(",")
  res.status(200).json(model.dataValues);
})
/**
 * sitemap
 */
video.get('/video/sitemap', async (req, res) => {
  //    limit: 1,offset: 0
  const model = await videoModule.findAndCountAll({ attributes: ['path', 'created', 'updated'], order: [['created', req.query.order || 'desc']], })
  if (!model) return res.status(404).json({ msg: '查询错误,请稍后再试' })
  model.rows.map((item, index) => {
    if (item.updated == 'Invalid date') model.rows[index].updated = item.created
  })
  res.status(200).json(model)
})
module.exports = video;