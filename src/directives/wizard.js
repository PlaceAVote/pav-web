var PAV = window.PAV || {};
var wizardDirective = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/wizard.html',
  };
};
PAV.wizardDirective = wizardDirective;
module.exports = wizardDirective;
