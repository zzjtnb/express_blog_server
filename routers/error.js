const express = require('express');
//1.创建一个路由容器
const router = express.Router();

//2.把路由都挂载到 router 路由容器
router.get('/404', (req, res) => {
  res.send('404')
});
router.get('/error', (req, res, next) => {
  res.send('错误')
});

module.exports = router;
