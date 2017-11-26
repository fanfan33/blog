var express = require('express');
var router = express.Router();
var Cate = require('../models/category')

/* GET home page. */
router.get('/', function(req, res, next) {
  Cate.fetch(function(err, cates) {
    res.render('pages/index', { 
      title: '首页',
      user: req.user,
      catelist: cates
    });
  })
  
});
router.get('/logout', function(req, res, next) {
  req.cookies.set('user',null);
  res.redirect('/');
  
});
module.exports = router;
