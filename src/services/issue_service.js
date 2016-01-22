var config = require('../config/endpoints.js');
var Issue = require('../../src/models/issue.js');

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

    var onLoad = function() {
      callback();
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.users.issue.endpoint;
    config.methods.put.headers.Authorization = token;
    var request = new $resource(url, undefined, {save: config.methods.put});

    request.save(issue, onLoad, onError);
  };

  var setIssueResponse = function(issue_id, response_value, callback) {
    if (!issue_id || !response_value) {
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
    config.methods.post.headers.Authorization = token;
    var request = new $resource(url, undefined, {setResponse: config.methods.post});

    var body = {
      issue_id: issue_id,
      emotional_response: response_value,
    };

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

  return {
    saveIssue: saveIssue,
    setIssueResponse: setIssueResponse,
    getIssueResponse: getIssueResponse,
  };
}

module.exports = IssueService;

