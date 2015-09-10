var express = require('express');
var router = express.Router();

var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js');

/* 首页路由 */
router.get('/', function(req, res, next) {
  res.render(
    'index',
    {
        title: '李林璞 | 前端工程师 | 个人网站',
        page: 'index',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    }
  );
});

module.exports = router;
