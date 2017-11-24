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
module.exports = router;
