var PAV = window.PAV || {};
var termsAndConditionsDirective = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/directives/terms_and_conditions.html',
  };
};
PAV.termsAndConditionsDirective = termsAndConditionsDirective;
module.exports = termsAndConditionsDirective;
