var voteEventDirective = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
    },
    templateUrl: 'partials/vote_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
module.exports = voteEventDirective;
