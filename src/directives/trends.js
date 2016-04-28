module.exports = function($location) {
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
