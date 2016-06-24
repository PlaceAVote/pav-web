var PAV = window.PAV || {};
var invalidDirective = function($scope) {
  return {
    restrict: 'E',
    templateUrl: 'partials/invalid.html',
  };
};
PAV.invalidDirective = invalidDirective;
module.exports = invalidDirective;
