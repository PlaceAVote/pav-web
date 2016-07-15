var openGraphDirective = function() {
  return {
    restrict: 'E',
    scope: {
      data: '=',
    },
    templateUrl: 'partials/open_graph.html',
  };
};
module.exports = openGraphDirective;
