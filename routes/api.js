var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Comment = require('../models/comment');
var Content = require('../models/content')


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
                
                
                userInfo.lastLoginAt = userInfo.thisLoginAt;
                userInfo.thisLoginAt= Date.now();
                userInfo.justTime = new Date(Date.now() - userInfo.lastLoginAt).getTime();
                
                userInfo.save(function(err, _userInfo) {
                    req.cookies.set('user',JSON.stringify({
                        userId: userInfo._id,
                        username: encodeURI(_userInfo.username),
                        justTime: _userInfo.justTime
                    }))
                    res.json({
                        success: true,
                        userInfo: {
                            userId: userInfo._id,
                            username: userInfo.username
                        }
                    })
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
    
    var endIndex = 15;
    var randomNum = Math.round(Math.random()*(endIndex-1)+1);
    var headIcon = 0;

    if ( ! req.cookies.get('headIcon')) {
        req.cookies.set('headIcon', randomNum);
        headIcon = randomNum;
    }else{
        headIcon = req.cookies.get('headIcon')
    }
    
    if (comInfo.cid) {          //处理回复
        Comment.findOne({_id: comInfo.cid}, function(err, comfind){
            var reply = {
                from: comInfo.from,
                to: comInfo.tid,
                txt: comInfo.txt,
                headIcon: headIcon
            }
            comfind.reply.push(reply);
            comfind.save(function(err, _comfind) {
                res.redirect('/content/'+comInfo.content)
            })
        })
    } else {                //当前新增
        comInfo.headIcon = headIcon;
        Comment.find({content: comInfo.content})
        .exec( function(err, _com) {
            var newCom = new Comment(comInfo);
            newCom.save(function(err, _newCom) {
                res.redirect('/content/'+comInfo.content)
            })
        })
    }
})
module.exports = router;
