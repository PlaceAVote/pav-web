var config = require('../config/endpoints.js');
var Issue = require('../models/issue.js');
var Comment = require('../models/comment.js');

function IssueService($resource, authService, callback) {
  var saveIssue = function(issue, callback) {
    if (!issue) {
      callback('Issue is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to save a issue');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.users.issue.endpoint;
    var request = new $resource(url, undefined, {save: config.methods.putData(issue, token)});

    request.save(issue, onLoad, onError);
  };


  var editIssue = function(issue_id, issue, callback) {
    if (!issue) {
      callback('Issue is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to save a issue');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.users.issue.endpoint + '/' + issue_id;
    var request = new $resource(url, undefined, {save: config.methods.postData(issue, token)});

    request.save(issue, onLoad, onError);
  };


  var deleteIssue = function(issue_id, callback) {
    if (!issue_id) {
      callback('Issue is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to  a issue');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };

    config.methods.deleteData.headers.Authorization = token;

    var url = config.users.issue.endpoint + '/' + issue_id;
    var request = new $resource(url, undefined, {delete: config.methods.deleteData});

    request.delete(onLoad, onError);
  };



  var setIssueResponse = function(issue_id, response_value, callback) {
    if (!issue_id || response_value === undefined) {
      callback('Issue id and response value is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to set issue response');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };

    var body = {
      emotional_response: response_value,
    };

    var url = config.users.issue.response(issue_id);
    var request = new $resource(url, undefined, {setResponse: config.methods.postData(body, token)});

    request.setResponse(body, onLoad, onError);
  };

  var deleteIssueResponse = function(issue_id, response_value, callback) {
    if (!issue_id || response_value === undefined) {
      callback('Issue id and response value is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to set issue response');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };


    var url = config.users.issue.response(issue_id);
    var request = new $resource(url, undefined, {setResponse: config.methods.del.delete(body, token)});

    request.setResponse(body, onLoad, onError);
  };

  var getIssueResponse = function(issue_id, callback) {
    if (!issue_id) {
      callback('Issue id is required');
      return;
    }

    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to get issue response');
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.users.issue.response(issue_id);
    config.methods.get.headers.Authorization = token;
    var request = new $resource(url, undefined, {getResponse: config.methods.get});

    request.getResponse(undefined, onLoad, onError);
  };

  var getIssue = function(issue_id, callback) {

    if (!issue_id) {
      callback('Issue id is required');
      return;
    }

    var token = authService.getAccessToken();

    var onLoad = function(result) {
      callback(undefined, new Issue(result));
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.users.issue.endpoint + '/' + issue_id;

    if (token) {
      config.methods.get.headers.Authorization = token;
    }

    var request = new $resource(url, undefined, {getIssue: config.methods.get});

    request.getIssue(undefined, onLoad, onError);
  };


  var postComment = function(id, comment, callback) {

    if (!id) {
      return callback({message: 'Issue Id is required to post a comment on an Issue'});
    }

    if (!comment) {
      return callback({message: 'A Comment is required to post'});
    }

    var postBody = {
      issue_id: id,
      body: comment,
    };

    var url = config.users.issue.comments.comment;
    config.methods.put.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {postComment: config.methods.put});

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(response) {
      var comment = new Comment(response);
      return callback(undefined, comment);
    };

    resource.postComment(postBody, onLoad, onError);

  };


  var fetchComments = function(id, order, lastComment, reply, callback) {

    reply = reply || false;

    if (!id) {
      return callback({message: 'Id Must Be Defined'});
    }

    var onLoad = function(res) {
      var results = {
        lastComment: res.last_comment_id,
        comments: [],
      };
      var comments = res.comments;
      var commentLength = comments.length;
      for (var i = 0; i < commentLength; i++) {
        var comment = new Comment(comments[i]);
        Comment.buildChildren(comment, undefined, reply);
        results.comments.push(comment);
      }

      return callback(undefined, results);
    };

    var onError = function(err) {
      console.log('error', err);
    };


    var url = config.users.issue.comments.fetchComments(id, order, lastComment);
    config.methods.get.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {fetchComments: config.methods.get});

    resource.fetchComments(undefined, onLoad, onError);
  };


  return {
    fetchComments: fetchComments,
    postComment: postComment,
    saveIssue: saveIssue,
    setIssueResponse: setIssueResponse,
    getIssueResponse: getIssueResponse,
    deleteIssueResponse: deleteIssueResponse,
    getIssue: getIssue,
    editIssue: editIssue,
    deleteIssue: deleteIssue,
  };
}

module.exports = IssueService;
