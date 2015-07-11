var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

// 数据库配置
var settings = require('./settings');
// 成功与错误信息的显示模块
var flash = require('connect-flash');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var app = express();

// 加载hbs模块
var hbs = require('hbs');

// 加载会话中间件
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// 使用flash
app.use(flash());

// 运行hbs模块
app.engine('html', hbs.__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 记录错误日志
app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.use('/users', users);

app.use(session({
  secret: settings.cookieSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30
  },//30 days
  url: settings.url
}));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    err.status === undefined ? err.status = 500 : err.status = 404;
    res.render('error', {
      title: err.message,
      error: err,
      page: 'error'
    });
    console.log(err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  err.status === undefined ? err.status = 500 : err.status = 404;
  res.render('error', {
    title: err.message,
    error: err,
    page: 'error'
  });
  console.log(err);
});

module.exports = app;
