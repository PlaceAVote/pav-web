var config = require('../config/endpoints.js');
var Comment = require('../models/comment.js');

function CommentService($resource, userService, authService) {
  var postingReply = false;
  var that = this;

  var reply = function(comment, context, parentId, callback) {
    if (!comment) {
      return callback('No Comment');
    }
    if (!context) {
      return callback('No Id');
    }
    if (!parentId) {
      return callback('No Parent Id');
    }

    var body = {};
    var url;

    if (context.type === 'bill') {
      body = {
        bill_id: context.id,
        body: comment,
      };
      url = config.comments.reply.endpoint(parentId);
    }

    if (context.type === 'issue') {
      body = {
        issue_id: context.id,
        body: comment,
      };
      url = config.users.issue.comments.reply.endpoint(parentId);
    }

    if (postingReply) {
      return;
    }

    postingReply = true;

    config.methods.put.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {reply: config.methods.put});
    var onError = function(err) {
      postingReply = false;
      return callback(err);
    };
    var onLoad = function(response) {
      postingReply = false;
      return callback(undefined, new Comment(response));
    };
    resource.reply(body, onLoad, onError);
  };

  var revoke = function(commentId, context, kind, callback) {
    if (!commentId) {
      return callback('No Comment Id');
    }
    if (!context) {
      return callback('No Context Defined');
    }

    var body = {};
    var url;

    if (context.type === 'bill') {
      body = {
        bill_id: context.id,
      };
      url = config.comments[kind].endpoint(commentId);
    }

    if (context.type === 'issue') {
      body = {
        issue_id: context.id,
      };
      url = config.users.issue.comments[kind].endpoint(commentId);
    }

    var resource = new $resource(url, undefined, {revoke: config.methods.del.delete(body, authService.getAccessToken())});

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.revoke(onLoad, onError);
  };



  var like = function(commentId, context, callback) {
    if (!commentId) {
      return callback('No Comment Id');
    }

    if (!context) {
      return callback('No Context Defined');
    }

    var body = {};
    var url;

    if (context.type === 'bill') {
      body = {
        bill_id: context.id,
      };
      url = config.comments.like.endpoint(commentId);
    }


    if (context.type === 'issue') {
      body = {
        issue_id: context.id,
      };
      url = config.users.issue.comments.like.endpoint(commentId);
    }


    config.methods.post.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {like: config.methods.post});

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.like(body, onLoad, onError);
  };


  var dislike = function(commentId, context, callback) {
    if (!commentId) {
      return callback('No Comment Id');
    }
    if (!context) {
      return callback('No Context Defined');
    }

    var body = {};
    var url;

    if (context.type === 'bill') {
      body = {
        bill_id: context.id,
      };
      url = config.comments.dislike.endpoint(commentId);
    }

    if (context.type === 'issue') {
      body = {
        issue_id: context.id,
      };
      url = config.users.issue.comments.dislike.endpoint(commentId);
    }

    config.methods.post.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {dislike: config.methods.post});

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      return callback(undefined, true);
    };
    resource.dislike(body, onLoad, onError);
  };

  // Edit Comments

  var edit = function(comment_id, context, callback) {
    if (!comment_id) {
      return;
    }

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(res) {
      return callback(undefined, new Comment(res));
    };

    var url;

    var body = {body: context.comment};

    if (context.type === 'bill') {
       url = config.comments.comments + comment_id;
    }

    if (context.type === 'issue') {
       url = config.users.issue.comments.comments + comment_id;
    }

    config.methods.post.headers.Authorization = authService.getAccessToken();
    var token = authService.getAccessToken();

    var editComment = new $resource(url, {}, {edit: config.methods.post});

    editComment.edit(body, onLoad, onError);

  };



  var deleteComment = function(comment_id, context, callback) {

    if (!context) {
      return;
    }

    if (!comment_id) {
      return;
    }

    var url;

    if (context.type === 'bill') {
       url = config.comments.comments + comment_id;
    }

    if (context.type === 'issue') {
       url = config.users.issue.comments.comments + comment_id;
    }

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(res) {
      return callback(undefined, res);
    };

    config.methods.deleteData.headers.Authorization = authService.getAccessToken();

    var editComment = new $resource(url, {}, {edit: config.methods.deleteData});

    editComment.edit(onLoad, onError);

  };


  return {
    revoke: revoke,
    reply: reply,
    like: like,
    dislike: dislike,
    edit: edit,
    deleteComment: deleteComment,
  };
}

module.exports = CommentService;
