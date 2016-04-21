var expect = require('chai').expect;
var NotificationEventFactory = require('../../src/factories/notification_event_factory.js');
var NotificationCommentReply = require('../../src/models/notification_comment_reply.js');
var response = require('../fixtures/notification_data.js');

describe('Single Response', function(){
  it('returns a comment for comment type', function(){
    var data = [{type: 'commentreply'}];
    var result = NotificationEventFactory.getResponses(data);
    expect(result.length).to.eql(1);
    expect(result[0].type).to.equal('commentreply');
  });
  it('ignores unknown types in notification factory', function(){
    var data = [{type: 'commentreply'}, {type: 'hippo'}];
    var result = NotificationEventFactory.getResponses(data);
    expect(result.length).to.eql(1);
    expect(result[0].type).to.equal('commentreply');
  });
});

