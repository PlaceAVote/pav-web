var NotificationReplyEvent = require('../models/notification_comment_reply.js');
var NotificationEmotionEvent = require('../models/notification_emotion_event.js');
// Private method, should always use the getResponses method

function NotificationEventFactory() {};

NotificationEventFactory.getResponse = function(response) {
  if (!response || !response.type) {
    throw {
      message: 'No Type Defined',
    };
  }
  switch (response.type) {
    case 'commentreply': {
      console.log('commentreply', response);
      return new NotificationReplyEvent(response);
    }
    case 'userissuer': {
      console.log('issue', response);
      return new NotificationEmotionEvent(response);
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
  console.log(responses.length);
  for (var i in responses) {
    console.log(i);
    results.push(NotificationEventFactory.getResponse(responses[i]));
  }
  return results;
};

module.exports = NotificationEventFactory;
