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
  console.log(id)
  var limit = 10;
  Cate.fetch(function(err,cates) {
    console.log(cates)
    Content.findOne({_id: id}, function(err, content) {
      console.log(content);
      Content.update({_id: id}, {$inc: {pv: 1}}, function(err){

        Comment.find({content: id})
          .sort({_id: -1})
          .limit(limit)
          // .populate('from', 'username')
          // .populate('reply.to reply.from', 'name')
          .exec(function(err, com) {
            console.log(com)
            res.render('pages/content',{
              title: '详情页',
              catelist: cates,
              id: content.cate,
              user: req.user,
              content: content,
              comment: com     
            })
        })
      })
    })
  })
  
})


// Comment.find({content: id}).count(function(count){
//   var page =  0;
//   var limit = 3;
//   var totalpage = Math.ceil(count / limit);
//   var index = page * limit;

//   Comment.find({content: id})
//   .sort({_id: -1})
//   .limit(limit)
//   .skip(index)
//   .exec(function(err, com) {
//     res.render('pages/content',{
//       title: '详情页',
//       catelist: cates,
//       id: content.cate,
//       user: req.user,
//       content: content ,
//       comment: com     
//     })
//   })
// })
module.exports = router;
