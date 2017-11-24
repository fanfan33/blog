var express = require('express');
var router = express.Router();
var User = require('../models/users')
var Cate = require('../models/category')

router.use(function (req, res, next) {
  if (!req.user.isAdmin) {
    res.send('你不是管理员哦');
    return;
  }
  next();
})

router.get('/', function (req, res, next) {
  res.render('admin/index', {
    title: '管理员'
  });
});

router.get('/user', function (req, res, next) {
  User.count(function (err, count) {
    var page = parseInt(req.query.page) || 0;
    var limit = 5;
    var index = page * limit;
    var totalpage = Math.ceil(count / limit);

    User.find()
      .limit(limit)
      .skip(index)
      .exec(function (err, users) {
        res.render('admin/user', {
          title: '用户管理',
          userList: users,
          totalpage: totalpage,
          limit: limit,
          page: page
        });
      })
  })
});
//分类
router.post('/cate/add', function (req, res, next) {
  var catename = req.body.catename;
  if (catename) {
    Cate.find({name: catename}, function(err, cate) {
      if (cate._id) {
        return res.json({success: false, msg: '已存在'})
      } else {
        var newCate = new Cate({
          name: catename
        })
        newCate.save(function(err){
          if (err) {
            console.log(err);
          }
          // res.redirect('/admin/cate/list');
          return res.json({success: true})
        })
      }
    })
  } else {
    return res.json({success: false, msg: '请输入具体内容'})
  }
});

//分类
router.get('/cate/add', function (req, res, next) {
  res.render('admin/cateAdd', {
    title: '新增分类'
  })
});
// 列表
router.get('/cate/list', function (req, res, next) {
  Cate.fetch(function(err, catelist){
    console.log(catelist)
    res.render('admin/cateList', {
      title: '所有分类',
      catelist: catelist
    })
  })
  
});


module.exports = router;