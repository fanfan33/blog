var express = require('express');
var router = express.Router();
var Cate = require('../models/category')
var Content = require('../models/content')
var Comment = require('../models/comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  Cate.fetch(function(err, cates) {
    var id = req.query.id;
    if (id) {
      Cate.findOne({_id: id})
        .populate('contents')
        .exec(function(err, cate) {
          res.render('pages/index_cate', { 
            title: '分类',
            user: req.user,
            catelist: cates,
            cateContents: cate.contents,
            id: id
          });
        })
    } else {
      res.render('pages/index', { 
        title: '首页',
        user: req.user,
        catelist: cates,
        id: ''
      });
    }
  })
});
router.get('/logout', function(req, res, next) {
  req.cookies.set('user',null);
  res.redirect('/');
});

router.get('/content/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  Cate.fetch(function(err,cates) {
    Content.findOne({_id: id}, function(err, content) {
      console.log(content);
      Content.update({_id: id}, {$inc: {pv: 1}}, function(err){

        Comment.find({content: id}, function(err, com) {
          res.render('pages/content',{
            title: '详情页',
            catelist: cates,
            id: content.cate,
            user: req.user,
            content: content ,
            comment: com     
          })
        })
        
      })
    })
  })
  
})
module.exports = router;
