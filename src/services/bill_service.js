var BillSummary = require('../models/bill_summary.js');
var Bill = require('../models/bill.js');
var Comment = require('../models/comment.js');
var config = require('../config/endpoints.js');
var TrendingBill = require('../models/trending_bill.js');

function BillService($resource, authService, userService) {
  var getBillVotes = function(id, callback) {
    if (!id) {
      return callback({message: 'Error: No Id Provided'});
    }
    var onLoad = function(result) {
      return callback(undefined, result);
    };
    var onError = function(err) {
      return callback(err);
    };
    var url = config.votes.voteRecords.endpoint + id;
    config.methods.getArray.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined,  {getBillVotes: config.methods.getArray});
    resource.getBillVotes(undefined, onLoad, onError);
  };

  var getBill = function(id, callback) {
    if (!id) {
      return callback({message: 'Error: No Id Provided'});
    }
    var onLoad = function(result) {
      console.log(result);
      return callback(undefined, new Bill(result));
    };
    var onError = function(err) {
      return callback(err);
    };
    var url = config.bills.getById.endpoint + id;
    config.methods.get.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, id,  {getById: config.methods.get});
    resource.getById(undefined, onLoad, onError);
  };

  var getTopComments = function(id, callback) {
    if (!id) {
      return callback({message: 'Id Must Be Defined'});
    }
    var onLoad = function(results) {
      var result = {
        forComment: new Comment(results['for-comment']),
        againstComment: new Comment(results['against-comment']),
      };
      return callback(undefined, result);
    };
    var onError = function(err) {
      return callback(err);
    };
    var url = config.bills.topComments.endpoint(id);
    config.methods.get.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, id,  {getComments: config.methods.get});
    resource.getComments(undefined, onLoad, onError);
  };

  var getComments = function(id, from, reply, callback) {
    reply = reply || false;
    if (!id) {
      return callback({message: 'Id Must Be Defined'});
    }
    if (!from) {
      from = 0;
    }
    var url = config.bills.comments.endpoint(id, from);
    config.methods.get.headers.Authorization = authService.getAccessToken();
    var resource = new $resource(url, undefined, {getComments: config.methods.get});

    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(response) {
      var results = [];
      var comments = response.comments;
      var commentLength = comments.length;
      for (var i = 0; i < commentLength; i++) {
        var comment = new Comment(comments[i]);
        Comment.buildChildren(comment, undefined, reply);
        results.push(comment);
      }
      return callback(undefined, results);
    };
    resource.getComments(undefined, onLoad, onError);
  };


  var postComment = function(id, comment, callback) {
    if (!id) {
      return callback({message: 'Bill Id is required to post a comment on a bill'});
    }
    if (!comment) {
      return callback({message: 'A Comment is required to post'});
    }
    var postBody = {
      bill_id: id,
      body: comment,
    };
    var url = config.bills.postComment.endpoint;
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

  var getTrends = function(callback) {
    var token = authService.getAccessToken();
    if (!token) {
      return callback({message: 'No Auth Token'});
    }

    var url = config.bills.trends.endpoint;
    config.methods.getArray.headers.Authorization = token;
    var resource = new $resource(url, undefined, {getTrends: config.methods.getArray});
    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(result) {
      var trends = result.map(function(t) {
        var trend = new TrendingBill(t);
        return trend;
      });
      callback(undefined, trends);
    };
    resource.getTrends(undefined, onLoad, onError);
  };

  return {
    getBillVotes: getBillVotes,
    getBill: getBill,
    getTopComments: getTopComments,
    getComments: getComments,
    postComment: postComment,
    getTrends: getTrends,
  };
}


module.exports = BillService;
