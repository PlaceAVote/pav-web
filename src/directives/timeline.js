var timelineDirective = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      timeline: '<',
      profile: '<',
    },
    templateUrl: 'partials/timeline.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
module.exports = timelineDirective;
