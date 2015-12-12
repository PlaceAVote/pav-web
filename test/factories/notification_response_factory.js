var expect = require('chai').expect;
var NotificationEventFactory = require('../../src/factories/notification_event_factory.js');
var CommentReplyEvent = require('../../src/models/comment_reply_event.js');

describe('Single Response', function(){
    it('returns a comment for comment type', function(){
      var result = NotificationEventFactory.getResponse({type: 'commentreply'});
      expect(result).to.be.an.instanceof(CommentReplyEvent);
    });
});
