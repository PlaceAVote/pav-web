var PAV = window.PAV || {};
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
PAV.voteEventDirective = voteEventDirective;
module.exports = voteEventDirective;
