var PAV = window.PAV || {};
var trends = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      data: '<',
      refresh: '<',
    },
    templateUrl: 'partials/trends.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
PAV.trendsDirective = trends;
module.exports = trends;
