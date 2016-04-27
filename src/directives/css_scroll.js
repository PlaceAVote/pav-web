module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      cssScrollWhen: '@cssScrollWhen',
      cssScrollBool: '='
    },
    link: function(scope, el, attr) {
      window.onscroll = function() {
        if (window.pageYOffset > scope.cssScrollWhen) {
          scope.cssScrollBool = true;
          scope.$apply();
        } else {
          scope.cssScrollBool = false;
          scope.$apply();
        }
      };
    },
  };
};
