module.exports = function($location) {
  console.log($location);
  return {
    restrict: 'E',
    replace: true,
    scope: {
      event: '=',
      user: '=',
    },
    templateUrl: 'partials/timeline_following_event.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
