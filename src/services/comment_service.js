var config = require('../config/endpoints.js');
var Comment = require('../models/comment.js');

function CommentService($resource, userService, authService) {

  var reply = function(comment, billId, parentId, callback) {
    if(!comment) {
      return callback('No Comment');
    }
    if(!billId) {
      return callback('No Bill Id');
    }
    if(!parentId) {
     return callback('No Parent Id');
    }
    var body = {
      bill_id: billId,
      body: comment,
    };
    config.methods.put.headers['Authorization'] = authService.getAccessToken();
    var url = config.comments.reply.endpoint(parentId);
    var resource = new $resource(url, undefined, {reply: config.methods.put});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(response) {
      return callback(undefined, new Comment(response));
    };
    resource.reply(body, onLoad, onError);
  };

  var like = function(commentId, billId, callback) {
    if (!commentId) {
      return callback('No Comment Id');
    }
    if (!billId) {
      return callback('No Bill Defined');
    }
    var url = config.comments.like.endpoint(commentId);
    config.methods.post.headers['Authorization'] = authService.getAccessToken();
    var resource = new $resource(url, undefined, {like: config.methods.post});
    var body = {
      bill_id: billId,
    };

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.like(body, onLoad, onError);
  };


  var dislike = function(commentId, billId, callback) {
    if (!commentId) {
      return callback('No Comment Id');
    }
    if (!billId) {
      return callback('No Bill Defined');
    }
    var url = config.comments.dislike.endpoint(commentId);
    config.methods.post.headers['Authorization'] = authService.getAccessToken();
    var resource = new $resource(url, undefined, {dislike: config.methods.post});
    var body = {
      bill_id: billId,
    };

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.dislike(body, onLoad, onError);
  };

  return {
    reply: reply,
    like: like,
    dislike: dislike,
  };
}

module.exports = CommentService;

