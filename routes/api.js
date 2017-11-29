var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Comment = require('../models/comment');


router.post('/register', function(req, res, next) {
    var params = req.body;
    var username = params.username;
    var pwd = params.password;
    
    if (!username || !pwd) {
        return res.json({success: false, msg: '请输入具体信息'})
    }
    User.findOne({username: username}, function(err, userInfo){
        if (err) {
            console.log(err);
        }
        
        if (userInfo) {
            res.json({success: false, msg: '用户已存在'})
        } else {
            var newUser = new User({
                username: username,
                password: pwd
            })
            newUser.save(function(err, resUser){
                if(err){console.log(err)}
                req.cookies.set('user',JSON.stringify({
                    userId: resUser._id,
                    username: encodeURI(resUser.username),
                    // username: resUser.username
                }))
                res.json({success:true})
            })
        }
    })
});

router.post('/login', function(req, res, next) {
    var params = req.body;
    var username = params.username;
    var pwd = params.password;

    User.findOne({username: username}, function(err, userInfo){
        if (err) {
            console.log(err);
        }
        if (userInfo) {
            if (pwd == userInfo.password) {
                console.log(userInfo);
               req.cookies.set('user',JSON.stringify({
                    userId: userInfo._id,
                    username: userInfo.username
               }))
                res.json({
                    success: true,
                    userInfo: {
                        userId: userInfo._id,
                        username: userInfo.username
                    }
                })
            } else {
                res.json({success:false,msg:'密码不正确'})
            }
        } else {
            res.json({success:false,msg:'用户不存在'})
        }
    })
});

router.post('/commentAdd', function(req, res) {
    var comInfo = req.body.comment;
    var ConId = comInfo.content;
    console.log(comInfo);
    new Comment(comInfo).save(function(err, com) {
        res.redirect('/content/'+ConId);
    })
})
module.exports = router;
