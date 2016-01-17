var Bill = require('../models/bill_summary.js');
var Comment = require('../models/comment.js');

function TrendService(tempTrendResource) {
  var getTrends = function(callback) {
    var onLoad = function(result) {
      for (var i = 0; i < result.length; i++) {
        switch (result[i].type) {
          case 'bill': {
            result[i] = new Bill(result[i]);
            break;
          }
          case 'comment': {
            result[i] = new Comment(result[i]);
            break;
          }
        }
      }
      callback(undefined, result);
    };
    var onError = function(err) {
      callback(err);
    };
    tempTrendResource.get(undefined, onLoad, onError);
  };
  return {
    getTrends: getTrends,
  };
}

module.exports = TrendService;
