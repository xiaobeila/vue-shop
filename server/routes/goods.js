var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop');

mongoose.connection.on('connected', function () {
    console.log('mongoDb connected success.')
})

mongoose.connection.on('error', function () {
    console.log('mongoDb connected fail.')
})

mongoose.connection.on('disconnected', function () {
    console.log('mongoDb connected disconnected.')
})

//查询商品列表数据
router.get('/list', function (req, res, next) {
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = parseInt(req.param("sort"));
    let skip = (page - 1) * pageSize;
    let priceLevel = req.param('priceLevel');
    let priceGt = '', priceLte = '';
    let params = {};

    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 100; break;
            case '1': priceGt = 100; priceLte = 500; break;
            case '2': priceGt = 500; priceLte = 1000; break;
            case '3': priceGt = 1000; priceLte = 5000; break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });
    goodsModel.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '400',
                msg: err.message
            });
        } else {
            res.json({
                status: '200',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    })
});

//加入到购物车
router.post('/addCart', function (req, res, next) {
    let userId = req.cookies.userId,
        productId = req.body.productId;
    let User = require('../models/user');
    User.findOne({ userId: userId }, function (err, userDoc) {
        if (err) {
            res.json({
                status: '400',
                msg: err.message
            });
        } else {
            if (userDoc) {
                var goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save(function (err2, doc2) {
                        if (err2) {
                            res.json({
                                status: '400',
                                msg: err2.message
                            });
                        } else {
                            res.json({
                                status: '200',
                                msg: '',
                                result: 'success'
                            });
                        }
                    });
                } else {
                    Goods.findOne({ productId: productId }, function (err1, doc1) {
                        if (err1) {
                            res.json({
                                status: '400',
                                msg: err1.message
                            })
                        } else {
                            if (doc1) {
                                doc1.productNum = 1;
                                doc1.checked = 1;
                                userDoc.cartList.push(doc1);
                                userDoc.save(function (err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: '400',
                                            msg: err2.message
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
                    });
                }
            }
        }
    })
});

module.exports = router;