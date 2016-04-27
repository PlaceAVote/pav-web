module.exports = function($compile, $window, $sce, $sanitize) {
  return {
    restrict: 'A',
    scope: {
      compile: '<',
    },
    // terminal: true,
    link: function(scope, element, attrs) {
      scope.window = $window;
      scope.$watch('compile', function(o, n) {
        if(n) {
          element.html(scope.compile);
          $compile(element.contents())(scope);
        }
      });
      scope.goToLink = function(url) {
        scope.window.open(url, '_blank');
      };

    },
  };
};
