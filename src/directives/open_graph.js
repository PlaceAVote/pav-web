module.exports = function($location) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
    },
    templateUrl: 'partials/open_graph.html',
  };
};
