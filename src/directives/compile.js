module.exports = function($compile, $window, $sce, $sanitize) {
  return {
    restrict: 'A',
    terminal: true,
    link: function(scope, element, attrs) {
      scope.window = $window;
      scope.$watch(function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      });

      scope.goToLink = function(url) {
        scope.window.open(url, '_blank');
      };


    },
  };
};
