const express = require('express'),
  router = express.Router();

// 首頁路由
router.get('/', function (req, res, next) {
  res.locals.title = ""
  res.render('index');
});

module.exports = router;
