module.exports = function() {
  return {
    restrict: 'A',
    scope: {
      cssScrollWhen: '@cssScrollWhen',
      cssScrollBool: '=',
      cssScrollTarget: '@cssScrollTarget',
    },
    link: function(scope, el, attr) {
      var area;
      var prop;

      if (scope.cssScrollTarget) {
        area = document.getElementsByClassName(scope.cssScrollTarget)[0];
      } else {
        area = window;
      }

      area.onscroll = function(e) {

        if (!area.pageYOffset) {
          prop = 'scrollTop';
        } else {
          prop = 'pageYOffset';
        }

        if (area[prop] > scope.cssScrollWhen) {
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
