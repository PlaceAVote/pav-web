var BillSummary = require('../models/bill_summary.js');
var config = require('../config/endpoints.js');
var Issue = require('../../src/models/issue.js');
var FeedResponseFactory = require('../factories/feed_response_factory.js');

function FeedService($resource, authService, userService) {
  var getFeed = function(timestamp, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback('Token is needed to get feed');
      return;
    }

    var onLoad = function(response) {
      console.log(response);
      try {
        var results = {
          last_timestamp: response.last_timestamp,
          feed: FeedResponseFactory.getResponses(response.results),
        };
        
        return callback(undefined, results);
      }
      catch (e) {
        return callback(e);
      }
    };

    var onError = function(err) {
      callback(err);
    };

    var url = config.feed.endpoint;
    body = {};
    if (timestamp) {
      body.from = timestamp;
    }
    config.methods.get.headers.Authorization = authService.getAccessToken();
    var request = new $resource(url, body, {getFeed: config.methods.get});
    request.getFeed(onLoad, onError);
  };
  return {
    getFeed: getFeed,
  };
}

module.exports = FeedService;

