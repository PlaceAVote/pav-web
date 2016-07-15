var feedVoteEvent = function($location) {
  return {
    retsrict: 'E',
    scope: {
      vote: '<',
    },
    templateUrl: 'partials/feed/feed_vote_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
module.exports = feedVoteEvent;
