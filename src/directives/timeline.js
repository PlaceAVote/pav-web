var PAV = window.PAV || {};
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
PAV.timelineDirective = timelineDirective;
module.exports = timelineDirective;
