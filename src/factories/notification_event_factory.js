var CommentReplyEvent = require('../models/comment_reply_event');

var NotificationEventFactory = {

  getResponse: function(response) {
    if(!response || !response.type) {
      throw {message: 'No Type Defined'};
    }
    switch (response.type) {
      case 'commentreply':
        console.log(response);
        return new CommentReplyEvent(response);
      default:
        console.log(response);
        return response;
    };
  },

  getResponses: function(responses) {
    var results = [];
    for(var i = 0; i < responses.length; i++) {
      results.push(NotificationEventFactory.getResponse(responses[i]));
    }
    return results
  },
};

module.exports = NotificationEventFactory;

