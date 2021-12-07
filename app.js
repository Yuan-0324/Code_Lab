// 引用模組
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 取得路由資源
const indexRouter = require('./routes/index');
const labRouter = require('./routes/lab');
const commentsRouter = require('./routes/comments');
const contactRouter = require('./routes/contact');
const apiRouter = require('./routes/api')

const app = express();

// 定義視圖引擎
app.set('views', path.join(__dirname, 'views'));
// EJS 模板
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// 設定前端資源路由 /assets => 可指向assets資料夾內的資源
app.use("/assets", express.static(path.join(__dirname, "assets")));
// 同上
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// 分配工作
app.use("/", indexRouter);
app.use("/lab", labRouter);
app.use("/comments", commentsRouter);
app.use("/contact", contactRouter);
app.use("/api", apiRouter);


// 以下 錯誤處理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // 把錯誤訊息傳到前端
  res.locals.message = "抱歉，此網頁無法從地球取得";
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 渲染模板出來
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
