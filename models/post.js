/**
 * [post.js 文章model]
 * @type {[type]}
 */
var mongodb = require('mongodb').MongoClient,
    markdown = require('markdown').markdown;

var settings = require('../settings');

function Post(name, title, post, abstract) {
  this.name = name;
  this.title = title;
  this.post = post;
  this.abstract = abstract;
}

module.exports = Post;

//存储一篇文章及其相关信息
Post.prototype.save = function(callback) {
    var date = new Date();
    //存储各种时间格式，方便以后扩展
    var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    }
    //要存入数据库的文档
    var post = {
      name: this.name,
      time: time,
      title: this.title,
      post: this.post,
      abstract: this.abstract,
    };
    //打开数据库
    mongodb.connect(settings.url, function (err, db) {
        if (err) {
          return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            //将文档插入 posts 集合
            collection.insert(post, {
                safe: true
            }, function (err) {
                db.close();
                if (err) {
                    return callback(err);//失败！返回 err
                }
                callback(null);//返回 err 为 null
            });
        });
    });
};

//获取所有文章及其相关信息（name为扩展选项，多用户情况）
Post.getAll = function(name, callback) {
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
        return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function(err, collection) {
        if (err) {
            db.close();
            return callback(err);
        }
        var query = {};
        if (name) {
            query.name = name;
        }
        //根据 query 对象查询文章
        collection.find(query).sort({
            time: -1
        }).toArray(function (err, docs) {
            db.close();
            if (err) {
                return callback(err);//失败！返回 err
            }
            //解析 markdown 为 html
            docs.forEach(function (doc) {
                doc.post = markdown.toHTML(doc.post);
            });
            callback(null, docs);//成功！以数组形式返回查询的结果
        });
    });
  });
};

/**
 * [getOne 获取文章详情]
 * @param  {[type]}   name     [用户名]
 * @param  {[type]}   day      [时间]
 * @param  {[type]}   title    [标题]
 * @param  {Function} callback [回调函数]
 * @return {[type]}            [description]
 */
Post.getOne = function(name, day, title, callback) {
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        db.close();
        if (err) {
          return callback(err);
        }
        //解析 markdown 为 html(文章内容和评论)
        if (doc) {
          doc.post = markdown.toHTML(doc.post);
        }
        callback(null, doc);//返回查询的一篇文章
      });
    });
  });
};

/**
 * [edit 返回原始发表的内容（markdown 格式）]
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.edit = function(name, day, title, callback) {
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //根据用户名、发表日期及文章名进行查询
      collection.findOne({
        "name": name,
        "time.day": day,
        "title": title
      }, function (err, doc) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//返回查询的一篇文章（markdown 格式）
      });
    });
  });
};

/**
 * [update 更新一篇文章及其相关信息]
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {[type]}   post     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.update = function(name, day, title, post, abstract, callback) {
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      console.log(name + day + title);
      //更新文章内容
      collection.update(
      {
        "name": name,
        "time.day": day,
        "title": title
      },
      {
        $set: {
          post: post,
          abstract: abstract
        }
      },
      function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};

/**
 * [remove 删除一篇文章]
 * @param  {[type]}   name     [description]
 * @param  {[type]}   day      [description]
 * @param  {[type]}   title    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Post.remove = function(name, day, title, callback) {
  //打开数据库
  mongodb.connect(settings.url, function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        db.close();
        return callback(err);
      }
      //根据用户名、日期和标题查找并删除一篇文章
      collection.remove({
        "name": name,
        "time.day": day,
        "title": title
      }, {
        w: 1
      }, function (err) {
        db.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};