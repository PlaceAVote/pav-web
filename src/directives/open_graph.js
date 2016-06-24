var PAV = window.PAV || {};
var openGraphDirective = function($location) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
    },
    templateUrl: 'partials/open_graph.html',
  };
};
PAV.openGraphDirective = openGraphDirective;
module.exports = openGraphDirective;
