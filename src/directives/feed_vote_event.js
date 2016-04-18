module.exports = function($location) {
  return {
    retsrict: 'E',
    scope: {
      vote: '=',
    },
    templateUrl: 'partials/directives/feed_vote_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
