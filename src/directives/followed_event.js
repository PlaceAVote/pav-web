var PAV = window.PAV || {};
var followedEventDirective = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
    },
    templateUrl: 'partials/followed_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
PAV.followedEventDirective = followedEventDirective;
module.exports = followedEventDirective;
