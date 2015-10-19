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
    var author = userService.getUser();
    if(!author || !author.email) {
     return callback('No User Defined');
    }
    var body = {
      bill_id: billId,
      author: author.email,
      body: comment,
    };
    config.methods.put.headers['Autherization'] = authService.getAccessToken();
    var url = config.comments.reply.endpoint(parentId);
    var resource = new $resource(url, undefined, {reply: config.methods.put});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(response) {
      return callback(undefined, new Comment(response));
    };
    resource.reply(body, onLoad, onError);
  }

  return {
    reply: reply,
  };
}

module.exports = CommentService;

