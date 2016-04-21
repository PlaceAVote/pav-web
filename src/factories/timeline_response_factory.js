var Comment = require('../models/comment.js');
var FollowedByUserEvent = require('../../src/models/followed_by_user_event');
var FollowingUserEvent = require('../../src/models/following_user_event.js');
var VoteEvent = require('../../src/models/vote_event.js');
var DislikeCommentEvent = require('../../src/models/dislike_comment_event.js');
var LikeCommentEvent = require('../../src/models/like_comment.js');
var IssueEvent = require('../../src/models/issue.js');

function TimelineResponseFactory() {}

TimelineResponseFactory.getResponse = function(response) {
  if (!response || !response.type) {
    return;
  }
  switch (response.type) {
    case 'comment': {
      return new Comment(response);
    }
    case 'vote': {
      return new VoteEvent(response);
    }
    case 'followinguser': {
      return new FollowingUserEvent(response);
    }
    case 'followedbyuser': {
      return new FollowedByUserEvent(response);
    }
    case 'likecomment': {
      return new LikeCommentEvent(response);
    }
    case 'dislikecomment': {
      return new DislikeCommentEvent(response);
    }
    case 'dislikecomment': {
      return new DislikeCommentEvent(response);
    }
    case 'userissue': {
      return new IssueEvent(response);
    }
    default: {
      return;
    }
  }
};

TimelineResponseFactory.getResponses = function(responses) {
  var results = [];
  for (var i = 0; i < responses.length; i++) {
    var timeEvent = TimelineResponseFactory.getResponse(responses[i]);
    if (timeEvent) {
      results.push(timeEvent);
    }
  }
  return results;
};

module.exports = TimelineResponseFactory;

