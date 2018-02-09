var express = require('express');
var router = express.Router();
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * 登入接口
 */
router.post('/login', function (req, res, next) {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }

  User.findOne(params, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.json({
          status: '200',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      }
    }
  });
});

//登出接口
router.post("/logout", function (req, res, next) {
  res.cookie("userId", "", {
    path: "/",
    maxAge: -1
  });
  res.json({
    status: "200",
    msg: '',
    result: ''
  })
});

//是否登录接口
router.get("/checkLogin", function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '200',
      msg: '',
      result: req.cookies.userName || ''
    });
  } else {
    res.json({
      status: '400',
      msg: '未登录',
      result: ''
    });
  }
});


/**
 * 获取购物车列表
 */
router.get('/cartList', function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      });
    } else {
      if (doc) {
        res.json({
          status: '200',
          msg: '',
          result: doc.cartList
        });
      }
    }
  })
});

/**
 * cartDel 购物车删除
 */
router.post('/cartDel', function (req, res, next) {
  let userId = req.cookies.userId,
    productId = req.body.productId;
  User.update({
    userId: userId
  }, {
      $pull: {
        'cartList': {
          'productId': productId
        }
      }
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '400',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '200',
          msg: '',
          result: 'success'
        });
      }
    })
});

/**
 * cartEdit 购物车编辑
 */
router.post('/cartEdit', function (req, res, next) {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({
    "userId": userId,
    "cartList.productId": productId
  }, {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    }, function (err, doc) {
      if (err) {
        res.json({
          status: '400',
          msg: err.message,
          result: ''
        });
      } else {
        res.json({
          status: '200',
          msg: '',
          result: 'success'
        });
      }
    })
});


/**
 * 1 选中 0 未选中
 * cartCheckAll 购物车全选
 */
router.post('/cartCheckAll', function (req, res, next) {
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll == 'true' ? "1" : "0";
  User.findOne({ userId: userId }, function (err, user) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        user.save(function (err1, doc) {
          if (err1) {
            res.json({
              status: '400',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '200',
              msg: '',
              result: 'success'
            })
          }
        })
      }
    }
  })
});

/**
 * 获取购物车总数
 */
router.post('/getCartCount', function (req, res, doc) {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: '400',
        msg: err.message,
        result: ''
      })
    } else {
      let cartList = doc.cartList;
      let cartCount = 0;
      cartList.map(function (item) {
        cartCount += parseFloat(item.productNum);
      })
      res.json({
        status: '200',
        msg: '',
        result: cartCount
      })
    }
  })
});

module.exports = router;
