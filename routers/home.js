const express = require('express');
const home = express.Router();

/* GET home page. */
home.get('/', function (req, res, next) {
  res.send('Hello World!')
});

module.exports = home;
