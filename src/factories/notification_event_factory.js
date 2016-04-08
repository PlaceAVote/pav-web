var NotificationReplyEvent = require('../models/notification_comment_reply.js');
var NotificationEmotionEvent = require('../models/notification_emotion_event.js');
var NotificationVoteEvent = require('../models/notification_vote_event.js');
// Private method, should always use the getResponses method

function NotificationEventFactory() {}

NotificationEventFactory.getResponse = function(response) {
  if (!response || !response.type) {
    throw {
      message: 'No Type Defined',
    };
  }
  switch (response.type) {
    case 'commentreply': {
      return new NotificationReplyEvent(response);
    }
    case 'issueresponse': {
      return new NotificationEmotionEvent(response);
    }
    case 'vote': {
      return new NotificationVoteEvent(response);
    }
    default: {
      return response;
    }
  }
};

NotificationEventFactory.getResponses = function(responses) {
  var results = [];
  if (!responses) {
    return results;
  }
  for (var i in responses) {
    results.push(NotificationEventFactory.getResponse(responses[i]));
  }
  return results;
};

module.exports = NotificationEventFactory;
