/**
 * 博客接口
 */
const express = require('express');
const blog = express.Router();
const jwt = require('jsonwebtoken');
const blogModule = require('../models/blogs'); // 导入用户的模型
// 请保证最先引入 cnchar 基础库，其他几个库顺序无所谓
const cnchar = require('cnchar');
const {Sequelize, Op} = require('sequelize');
const md = require('markdown-it')('commonmark');
const moment = require('moment');
moment.locale('zh-cn');
//http://localhost:3000/api/v1/blog/test
blog.get('/blog/test', (req, res) => {
  res.status(200).json({msg: '博客测试接口'});
});
blog.post('/blog/add', async (req, res) => {
  if (!req.body.title) return res.status(404).json({msg: '请输入标题'});
  const token = req.headers.authorization.split(' ').pop();
  if (!req.headers.authorization) return res.status(404).json({msg: '请登录后操作'});
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({msg: '登录信息已过期,请重新登陆后重试'});
  });
  req.body.created = req.body.created || new Date();
  const model = await blogModule.findOne({where: {title: req.body.title}});
  if (model) return res.status(404).json({msg: '存在同名博客'});
  req.body.path = req.body.title.spell('first').toLowerCase().replace(/\W/g, ''); //匹配一个非单字字符。等价于 [^A-Za-z0-9_]。
  if (typeof req.body.tags !== 'string') return res.status(404).json({msg: '编辑失败,标签类型不对'});
  req.body.tags = JSON.stringify(req.body.tags).replace(/\s+/g, '');
  const result = await blogModule.create(req.body);
  if (!result) return res.status(404).json({msg: '保存失败'});
  res.status(200).json({msg: '保存成功'});
});
blog.delete('/blog/delete', async (req, res) => {
  if (!req.query.path) return res.status(404).json({msg: '请输入博客路径'});
  const token = req.headers.authorization.split(' ').pop();
  if (!req.headers.authorization) return res.status(404).json({msg: '请登录后操作'});
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({msg: '登录信息已过期,请重新登陆后重试'});
  });
  const model = await blogModule.findOne({where: {path: req.query.path}});
  if (!model) return res.status(404).json({msg: '该博客不存在'});
  const result = await blogModule.destroy({where: {path: req.query.path}});
  if (!result) return res.status(404).json({msg: '删除失败'});
  res.status(200).json({msg: '删除成功'});
});
blog.put('/blog/edit', async (req, res) => {
  let oldPath = req.body.path;
  const token = req.headers.authorization.split(' ').pop();
  if (!req.headers.authorization) return res.status(404).json({msg: '请登录后操作'});
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(404).json({msg: '登录信息已过期,请重新登陆后重试'});
  });
  const model = await blogModule.findOne({where: {path: oldPath}});
  if (!model) return res.status(404).json({msg: '该博客不存在'});
  req.body.path = req.body.title.spell('first').toLowerCase().replace(/\W/g, ''); //匹配一个非单字字符。等价于 [^A-Za-z0-9_]。
  if (typeof req.body.tags !== 'string') return res.status(404).json({msg: '编辑失败,标签类型不对'});
  req.body.tags = JSON.stringify(req.body.tags).replace(/\s+/g, '');
  req.body.updated = new Date();
  blogModule
    .update(req.body, {where: {path: oldPath}})
    .then((result) => {
      res.status(200).json({msg: '编辑成功'});
    })
    .catch((err) => {
      res.status(404).json({msg: '编辑失败,请稍后重试'});
    });
});
/**
 * 所有列表
 */
blog.get('/blog/list', (req, res) => {
  let page = 0;
  let per_page = 17;
  if (req.query.page) {
    if (Number(req.query.page) - 1 < 0) return res.status(404).json({error: '查询参数错误'});
    page = Number(req.query.page) - 1;
    per_page = Number(req.query.per_page);
  }
  blogModule
    .findAndCountAll({
      order: [
        // 按创建时间倒叙
        ['created', req.query.order || 'desc'],
      ],
      limit: per_page, //第几页
      offset: page * per_page, //每页条数
    })
    .then((result) => {
      result.rows.map((item, index) => {
        if (item.content)
          result.rows[index].content = md
            .render(item.content)
            .replace(/(<[^>]+>)|\\n/gi, '')
            .substring(0, 200);
        if (item.tags) result.rows[index].tags = JSON.parse(item.tags).split(',');
      });
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(404).json({error: '查询错误'});
    });
});
/**
 * 单个详情
 */
blog.get('/blog/details', async (req, res) => {
  if (!req.query.path) return res.status(404).json({msg: '请传入博客路径'});
  const model = await blogModule.findOne({where: {path: req.query.path}});
  if (!model) return res.status(404).json({msg: '该博客不存在'});
  blogModule.update({pageviews: model.dataValues.pageviews + 1}, {where: {path: req.query.path}});
  model.dataValues.pageviews = model.dataValues.pageviews + 1;
  // JS字符串转数组
  // model.dataValues.tags = model.dataValues.tags.split(',')//逗号是分隔符,在每个逗号(,)
  if (model.dataValues.tags) model.dataValues.tags = JSON.parse(model.dataValues.tags).split(',');
  if (model.dataValues.created) model.dataValues.created = moment(model.dataValues.created).format('YYYY-MM-DD HH:mm:ss');
  if (model.dataValues.updated) model.dataValues.updated = moment(model.dataValues.updated).format('YYYY-MM-DD HH:mm:ss');
  // JS数组转字符串
  // let a = ['a', 'b']
  // a = a.join(",")
  res.status(200).json(model.dataValues);
});
/**
 * 分类列表
 */
blog.get('/blog/sortList', async (req, res) => {
  //SELECT sort as 分类,COUNT(*) as 次数 FROM blogs GROUP BY sort
  const model = await blogModule.findAndCountAll({
    attributes: ['sort', [Sequelize.fn('COUNT', Sequelize.col('sort')), 'count']],
    group: ['sort'],
  });
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  res.status(200).json(model.count);
});
/**
 * 分类详情
 */
blog.get('/blog/sort', async (req, res) => {
  if (req.query.sort == 'undefined') req.query.sort = '';
  if (Number(req.query.page) - 1 == -1) return res.status(404).json({error: '查询参数错误'});
  let page = Number(req.query.page) - 1;
  let per_page = Number(req.query.per_page);
  const model = await blogModule.findAndCountAll({
    order: [['created', req.query.order || 'desc']],
    limit: per_page,
    offset: page * per_page,
    where: {sort: {[Op.like]: `%${req.query.sort}%`}},
  });
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  model.rows.map((item, index) => {
    model.rows[index].content = md
      .render(item.content)
      .replace(/(<[^>]+>)|\\n/gi, '')
      .substring(0, 200);
    model.rows[index].tags = JSON.parse(item.tags).split(',');
  });
  res.status(200).json(model);
});
/**
 * 标签列表
 */
blog.get('/blog/tagsList', async (req, res) => {
  const model = await blogModule.findAndCountAll({attributes: ['tags']});
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  let arr = [];
  model.rows.map((item, index) => {
    model.rows[index].tags = JSON.parse(item.tags).split(',');
    arr.push(model.rows[index].tags);
  });
  //引入下面两个服务器卡死
  // const repeatNum = require('../utils/repeatNum');
  // let tagsList = await repeatNum.getRepeatNum(arr)
  res.status(200).json(arr);
});
// blog.get('/blog/tagsList', async (req, res) => {
//   const { count, rows } = await blogModule.findAndCountAll({
//     attributes: ['tags', [Sequelize.fn('COUNT', Sequelize.col('tags')), 'count']],
//     group: ['tags']
//   })
//   res.status(200).json(count)
// })
/**
 * 标签
 */
blog.get('/blog/tags', async (req, res) => {
  if (req.query.tags == 'undefined') req.query.tags = '';
  if (Number(req.query.page) - 1 == -1) return res.status(404).json({error: '查询参数错误'});
  let page = Number(req.query.page) - 1;
  let per_page = Number(req.query.per_page);
  const model = await blogModule.findAndCountAll({
    order: [['created', req.query.order || 'desc']],
    limit: per_page,
    offset: page * per_page,
    where: {tags: {[Op.like]: `%${req.query.tags}%`}},
  });
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  model.rows.map((item, index) => {
    model.rows[index].content = md
      .render(item.content)
      .replace(/(<[^>]+>)|\\n/gi, '')
      .substring(0, 200);
    model.rows[index].tags = JSON.parse(item.tags).split(',');
  });
  res.status(200).json(model);
});
/**
 * 搜索
 */
blog.get('/blog/search', async (req, res) => {
  if (Number(req.query.page) - 1 == -1) return res.status(404).json({error: '查询参数错误'});
  let page = Number(req.query.page) - 1;
  let per_page = Number(req.query.per_page);

  const model = await blogModule.findAndCountAll({
    order: [['created', req.query.order || 'desc']],
    limit: per_page,
    offset: page * per_page,
    where: {
      [Op.or]: [
        {title: {[Op.like]: `%${req.query.value}%`}},
        {tags: {[Op.like]: `%${req.query.value}%`}},
        {sort: {[Op.like]: `%${req.query.value}%`}},
        {content: {[Op.like]: `%${req.query.value}%`}},
      ],
    },
  });
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  model.rows.map((item, index) => {
    model.rows[index].content = md
      .render(item.content)
      .replace(/(<[^>]+>)|\\n/gi, '')
      .substring(0, 200);
    model.rows[index].tags = JSON.parse(item.tags).split(',');
  });
  res.status(200).json(model);
});
/**
 * sitemap
 */
blog.get('/blog/sitemap', async (req, res) => {
  //    limit: 1,offset: 0
  const model = await blogModule.findAndCountAll({attributes: ['path', 'created', 'updated'], order: [['created', req.query.order || 'desc']]});
  if (!model) return res.status(404).json({msg: '查询错误,请稍后再试'});
  model.rows.map((item, index) => {
    if (item.updated == 'Invalid date') model.rows[index].updated = item.created;
  });
  res.status(200).json(model);
});
module.exports = blog;
