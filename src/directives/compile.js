var compileDirective = function($compile, $window, $sce, $sanitize) {
  return {
    restrict: 'A',
    scope: {
      compile: '<',
    },
    link: function(scope, element, attrs) {
      scope.window = $window;
      scope.$watch('compile', function(n, o) {
        if (n) {
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
module.exports = compileDirective;
