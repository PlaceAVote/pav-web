module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=',
      profile: '=',
      toggle: '=',
    },
    templateUrl: 'partials/banner.html',
    link: function(scope, el, attr) {
      scope.toggleFollowers = function() {
        if (scope.toggle) {
          scope.toggle = false;
        } else {
          scope.toggle = true;
        }
      };
    },
  };
};
