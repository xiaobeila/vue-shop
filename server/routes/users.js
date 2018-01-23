var express = require('express');
var router = express.Router();
var User = require('./../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * 获取购物车列表
 */
router.get('/cartList', function (req, res, next) {
  let userId = '001';
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
  let userId = '001',
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


module.exports = router;
