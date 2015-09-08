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

// 关于我页面路由
router.get('/about', function(req, res, next) {
  res.render(
    'about',
    {
      active: 'about',
      title: '关于我 | 李林璞 | 前端工程师',
      page: 'about'
    }
  );
});

// 联系我页面路由
router.get('/contact', function(req, res, next) {
  res.render(
    'contact',
    {
      active: 'contact',
      title: '联系我 | 李林璞 | 前端工程师',
      page: 'contact'
    }
  );
});

// 旅游页面路由
router.get('/travel', function(req, res, next) {
  res.render(
    'travel',
    {
      active: 'travel',
      title: '旅游相册 | 李林璞 | 前端工程师',
      page: 'travel'
    }
  );
});

// 文章目录页路由
router.get('/article_category', function(req, res, next) {
  Post.getAll(null, function (err, posts) {
    if (err) {
      posts = [];
    }
    res.render(
      'article_category',
      {
        active: 'article_category',
        title: '技术与生活 | 李林璞 | 前端工程师',
        page: 'article_category',
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
  });
});

// 文章详情页路由
router.get('/u/:name/:day/:title', function (req, res) {
  Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    res.render('article', {
      active: 'article_category',
      page: 'article_category',
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

// 后台登陆页get请求路由
router.get('/lilinpu', function(req, res, next) {
  res.render(
    'login',
    {
      active: 'login',
      title: '登录 | 李林璞 | 前端工程师',
      page: 'login',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    }
  );
});

// 屏蔽注册功能
router.get('/reg', function(req, res, next) {
  res.render(
    'reg',
    {
      active: 'reg',
      title: '注册 | 李林璞 | 前端工程师',
      page: 'reg',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    }
  );
});

router.post('/reg', function (req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!');
    return res.redirect('/reg');//返回注册页
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });
  //检查用户名是否已经存在
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回注册页
      }
      req.session.user = user;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
});

// 后台登陆页post请求路由
router.post('/lilinpu', function (req, res) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!');
      return res.redirect('/lilinpu');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!');
      return res.redirect('/lilinpu');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/admin');//登陆成功后跳转到后台管理页
  });
});

router.get('/admin', checkLogin);
// 后台管理页get请求路由（编辑文章）
router.get('/admin', function (req, res) {
  res.render('admin', {
    title: '后台管理',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});


// 后台管理页post请求路由（发表文章）
router.post('/admin', checkLogin);
router.post('/admin', function (req, res) {
  var currentUser = req.session.user,
      post = new Post(currentUser.name, req.body.title, req.body.post, req.body.abstract);
  post.save(function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发布成功!');
    res.redirect('/article_category');//发表成功跳转到文章列表页
  });
});

// 编辑文章页面get请求路由
router.get('/edit/:name/:day/:title', checkLogin);
router.get('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    res.render('edit_article', {
      title: '编辑文章',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

//编辑文章页面post请求路由
router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, req.body.abstract, function (err) {
    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
    if (err) {
      req.flash('error', err);
      return res.redirect(url);//出错！返回文章页
    }
    req.flash('success', '修改成功!');
    res.redirect(url);//成功！返回文章页
  });
});

//删除文章路由
router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
    req.flash('success', '删除成功!');
    res.redirect('/article_category');
  });
});

// 检查是否已登录
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!');
    res.redirect('/lilinpu');
  }
  next();
}

module.exports = router;
