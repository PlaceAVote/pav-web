var expect = require('chai').expect;
var TimelineResponseFactory = require('../../src/factories/timeline_response_factory.js');
var Comment = require('../../src/models/comment.js');
var FollowedByUserEvent = require('../../src/models/followed_by_user_event.js');
var FollowingUserEvent = require('../../src/models/following_user_event.js');
var VoteEvent = require('../../src/models/vote_event.js');
var DislikeCommentEvent = require('../../src/models/dislike_comment_event.js');
var LikeCommentEvent = require('../../src/models/like_comment.js');

describe('Single Response', function(){
    it('throws no error if no type is defined', function(){
      var fn = function() {
        var result = TimelineResponseFactory.getResponse();
      }
      expect(fn).to.not.throw({message:'No Type Defined'});
    });
    it('returns a comment for comment type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'comment'});
      expect(result).to.be.an.instanceof(Comment);
    });
    it('returns a followedbyuser for followedbyuser type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'followedbyuser', first_name: 'Paul'});
      expect(result).to.be.an.instanceof(FollowedByUserEvent);
      expect(result.first_name).to.eql('Paul');
    });
    it('returns a followedbyuser for followedbyuser type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'followinguser', first_name: 'Paul'});
      expect(result).to.be.an.instanceof(FollowingUserEvent);
      expect(result.first_name).to.eql('Paul');
    });
    it('returns a dislikecomment for dislikecomment type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'dislikecomment', author: 'Paul'});
      expect(result).to.be.an.instanceof(DislikeCommentEvent);
      expect(result.comment.author).to.eql('Paul');
    });
    it('returns a like for likecomment type', function(){
      var result = TimelineResponseFactory.getResponse({type: 'likecomment', author: 'Paul'});
      expect(result).to.be.an.instanceof(LikeCommentEvent);
      expect(result.comment.author).to.eql('Paul');
    });
    it('returns a vote event for vote type', function(){
      var response = {type: 'vote'};
      response['vote-id'] = '1990';
      var result = TimelineResponseFactory.getResponse(response);
      expect(result).to.be.an.instanceof(VoteEvent);
      expect(result.vote_id).to.eql('1990');
    });
    it('throws no error when default', function(){
      var fn = function() {
        var result = TimelineResponseFactory.getResponse({type: 'cat'});
      }
      expect(fn).to.not.throw({message:'Type Not Supported'});
    });
});
describe('Multiple Responses', function() {
  it('returns an array of the same length', function(){
    var responses = [{type: 'comment'}, {type: 'comment'}, {type: 'comment'}]
    var results = TimelineResponseFactory.getResponses(responses);
    expect(results.length).to.eql(3);
  });
  it('returns an array without the unknown types', function(){
    var responses = [{type: 'comment'}, {type: 'comment'}, {type: 'comment'}, {type: 'dog'}]
    var results = TimelineResponseFactory.getResponses(responses);
    expect(results.length).to.eql(3);
  });
});

