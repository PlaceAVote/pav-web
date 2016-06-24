var PAV = window.PAV || {};
var headerDirective = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/header.html',
  };
};
PAV.headerNavDirective = headerDirective;
module.exports = headerDirective;
