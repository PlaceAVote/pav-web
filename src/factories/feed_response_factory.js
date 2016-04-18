var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');
var VoteEvent = require('../models/vote_event.js');

function FeedResponseFactory() {}

FeedResponseFactory.getResponse = function(response) {
  if (!response || !response.type) {
    return;
  }
  switch (response.type) {
    case 'bill': {
      return new BillSummary(response);
    }
    case 'userissue': {
      return new Issue(response);
    }
    case 'vote' : {
      return new VoteEvent(response);
    }
    default: {
      return;
    }
  }
};

FeedResponseFactory.getResponses = function(responses) {
  var results = [];
  for (var i = 0; i < responses.length; i++) {
    var feedResponse = FeedResponseFactory.getResponse(responses[i]);
    if (feedResponse) {
      results.push(feedResponse);
    }
  }
  return results;
};

module.exports = FeedResponseFactory;

