 angular.module('pavDirectives', []).
  directive('headerNav', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/header.html'
    };
  });
