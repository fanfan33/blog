var express = require('express');
var router = express.Router();
var underscore = require('underscore');
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
  var _cate = req.body;
  var catename = _cate.catename;
  if (_cate.cateId) {
    Cate.findOne({_id: _cate.cateId},function(err, cate) {
        cate.name = _cate.catename;
        cate.save(function(err, _newcate){
          return res.json({success: true})
        })
      })
  }
  else
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
      title: '新增分类',
      category: ''
    })
  
});
// 列表
router.get('/cate/list', function (req, res, next) {
  Cate.find()
    .sort({_id: -1})
    .exec(function(err, catelist){
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
  var id = req.params.id;
  if (id) {
    Cate.findOne({_id: id}, function(err, cate) {
      console.log(cate)
      res.render('admin/cateAdd', {
        title: '更改分类',
        category: cate
      })
    })
    
  }
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
      cates: cates,
      con: {}
    })
  })
})
//内容保存 及 更改后的保存
router.post('/content/add', function(req, res) {
  var box = req.body.con;
  if (box._id) {
    //更新
    Content.findOne({_id: box._id}, function(err, oldCon) {
      var _newInfo = underscore.extend(oldCon, box);
      new Content(_newInfo).save(function(err, content) {
        res.redirect('/admin/content/list');
      })
    })
    
  } else {
    //新增
    var cateId = box.cate;
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
  }
})

//内容列表显示
router.get('/content/list', function(req, res) {
  var id = req.query.id;

  if (id) {
    Cate.fetch(function(err, cates) {
      Cate.findOne({_id: id})
        .populate('contents')
        .exec(function(err, category) {
          res.render('admin/contentList', {
            title: '内容列表',
            cates: cates,
            cons: category.contents,
            $id: id
          })
        })
    })
  } else {
    Cate.fetch(function(err, cates) {
      var firstCateId = cates[0]._id;
      Cate.findOne({_id: firstCateId})
        .populate('contents')
        .exec(function(err, firstCon) {
          res.render('admin/contentList', {
            title: '内容列表',
            cates: cates,
            cons: firstCon.contents,
            $id: ''
          })
        })
    })
  }
})
router.get('/content/update/:id', function(req, res) {
  var id = req.params.id;
  if (id) {
    Content.findOne({_id: id})
      .populate('cate')
      .exec(function(err, con) {
        res.render('admin/contentAdd', {
          title: '内容更新',
          con: con
        })
    })
  }
})

module.exports = router;