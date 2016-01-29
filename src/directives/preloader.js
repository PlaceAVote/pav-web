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
  };
};





