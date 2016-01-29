module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_tax_multi.html',
  };
};
