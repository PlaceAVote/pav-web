var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');

function FeedResponseFactory() {}

FeedResponseFactory.getResponse = function(response) {
  if (!response || !response.type) {
    throw {
      message: 'No Type Defined',
    };
  }
  switch (response.type) {
    case 'bill': {
      return new BillSummary(response);
    }
    case 'userissue': {
      return new Issue(response);
    }
    default: {
      throw {
        message: 'Type Not Supported',
      };
    }
  }
};

FeedResponseFactory.getResponses = function(responses) {
  var results = [];
  for (var i = 0; i < responses.length; i++) {
    results.push(FeedResponseFactory.getResponse(responses[i]));
  }
  return results;
};

module.exports = FeedResponseFactory;

