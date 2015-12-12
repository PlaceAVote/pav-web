var CommentReplyEvent = require('../models/comment_reply_event');

// Private method, shuold always use the getResponses method
var getResponse = function(response) {
  if(!response || !response.type) {
    throw {message: 'No Type Defined'};
  }
  switch (response.type) {
    case 'commentreply':
      return new CommentReplyEvent(response);
    default:
      return response;
  };
};

var NotificationEventFactory = {
  // Entry point for factory always returns an
  // Array regardless if there is no response,
  // one Response or many.
  getResponses: function(responses) {
    var results = [];
    if (!responses) {
      return results;
    }
    response = JSON.parse(responses);

    if (response.constructor != Array) {
      results.push(getResponse(response));
      return results;
    }

    for(var i = 0; i < responses.length; i++) {
      results.push(NotificationEventFactory.getResponse(responses[i]));
    }
    return results
  },
};

module.exports = NotificationEventFactory;
