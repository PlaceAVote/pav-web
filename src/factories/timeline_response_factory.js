var Comment = require('../models/comment.js');
function TimelineResponseFactory(){}

TimelineResponseFactory.getResponse = function(response) {
  if(!response || !response.type) {
    throw {message: 'No Type Defined'};
  }
  switch (response.type) {
    case 'comment':
      return new Comment(response);
    case 'vote':
      return 'vote';
    case 'followinguser':
      return 'fu';
    case 'followedbyuser':
      return 'followedbyuser';
    case 'likecomment':
      return 'likecomment';
    case 'dislikecomment':
      return 'dislikecomment'
    default:
      throw({message: 'Type Not Supported'});
  };
};

TimelineResponseFactory.getResponses = function(responses) {
  var results = [];
  for(var i = 0; i < responses.length; i++) {
    results.push(TimelineResponseFactory.getResponse(responses[i]));
  }
  return results
};

module.exports = TimelineResponseFactory;

