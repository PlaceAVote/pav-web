module.exports = function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
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
