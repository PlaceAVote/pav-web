module.exports = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
    },
    templateUrl: 'partials/following_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
