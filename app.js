var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var Cookies = require('cookies');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var mongoStore = require('connect-mongo')(session);

var index = require('./routes/index');
var admin = require('./routes/admin');
var api = require('./routes/api');

var app = express();
var moment = require('moment');     //时间插件
moment.locale('zh-cn');
app.locals.moment = moment;

var dbUrl = 'mongodb://localhost/blogdb'
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var User = require('./models/users')

app.use(function(req, res, next){
  req.cookies = new Cookies(req, res);
  req.user = {};
  if (req.cookies.get('user')) {
    try {
      req.user = JSON.parse(req.cookies.get('user'));
      User.findById(req.user.userId,function(err, user) {
        if (user) {
          req.user.isAdmin = Boolean(user.isAdmin);
        }
        next();
      })
    } catch (error) {
      next();
    }
  }else{
    next()
  }
 
})


app.use('/', index);
app.use('/admin', admin);
app.use('/api', api);


// app.use(session({
//   secret: 'blog',
//   store: new mongoStore({
//     url: dbUrl,
//     collection: 'sessions'
//   }),
//   resave: false,
//   saveUninitialized: true
// }))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
