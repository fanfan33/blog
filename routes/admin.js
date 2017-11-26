var express = require('express');
var router = express.Router();
var User = require('../models/users')
var Cate = require('../models/category')
var Content = require('../models/content')

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
//用户列表
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
//用户删除
router.delete('/user/del', function(req, res) {
  var id = req.query.id;
  if (id) {
    User.remove({_id: id}, function(err){
      if (err) {
        console.log(err);
      }
      res.json({success: true})
    })
  }
})
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
    res.render('admin/cateList', {
      title: '所有分类',
      catelist: catelist
    })
  })
});

//分类查看 具体的
router.get('/cate/:id', function(req, res) {
  var id = req.query.id;
})

//更新分类
router.get('/cate/update/:id', function(req, res) {
  var id = req.query.id;
})
//删除分类
router.delete('/cate/del', function(req, res) {
  var id = req.query.id;
  if (id) {
    Cate.remove({_id: id}, function(err){
      if (err) {
        console.log(err);
      }
      res.json({success: true})
    })
  }
})

//内容聚集地
router.get('/content/add',function(req, res) {
  Cate.fetch(function(err, cates) {
    res.render('admin/contentAdd', {
      title: '内容新增',
      cates: cates
    })
  })
})

router.post('/content/add', function(req, res) {
  var box = req.body.con;
  var cateId = box.cate;
  console.log(box);

  var newInfo = new Content(box);
  newInfo.save(function(err, _box) {
    Cate.findOne({_id: cateId}, function(err, cate){
      console.log(cate);
      cate.contents.push(_box._id);
      cate.save(function(err){
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/content/list');
      })
    })
  })



})

router.get('/content/list', function(req, res) {
  Cate.fetch(function(err, cates) {
    res.render('admin/contentList', {
      title: '内容列表',
      cates: cates
    })
  })
})

module.exports = router;