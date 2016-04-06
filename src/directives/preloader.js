module.exports = function(location) {
  return {
    restrict: 'A',
    transclude: true,
    controller: function() {},
    controllerAs: 'ctrl',
    bindToController: {
      context: '=loaderContext',
    },
    templateUrl: 'partials/directives/preloader.html',
    link: function(scope, el, attr) {
      if (attr.$attr.truthy) {
        scope.show = true;
      }
      if (attr.$attr.falsey) {
        scope.show = false;
      }
      if (attr.$attr.white) {
        scope.white = true;
      }
    },
  };
};





