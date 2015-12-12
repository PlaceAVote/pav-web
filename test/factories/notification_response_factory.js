var expect = require('chai').expect;
var NotificationEventFactory = require('../../src/factories/notification_event_factory.js');
var CommentReplyEvent = require('../../src/models/comment_reply_event.js');
var response = require('../fixtures/notification_data.js');

describe('Single Response', function(){
    it('returns a comment for comment type', function(){
      var result = NotificationEventFactory.getResponses(response.data);
      expect(result.length).to.eql(1);
      expect(result[0]).to.be.an.instanceof(CommentReplyEvent);
    });
});

