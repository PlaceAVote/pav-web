var PAV = window.PAV || {};
var invalidDirective = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/invalid.html',
  };
};
PAV.invalidDirective = invalidDirective;
module.exports = invalidDirective;
