module.exports = function($filter, $location) {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_tax_multi.html',
    link: function(scope, el, attr) {
      scope.location = $location;
      scope.$watch('question', function(n, o) {
        if (n !== undefined) {
          scope.question.sliderConfig = {
            showSelectionBar: true,
            ceil: scope.question.range.max,
            minRange: 0,
            step: scope.question.range.step,
            hideLimitLabels: true,
            translate: function(value) {
              return $filter('currency')(value, undefined, 0);
            },
          };
        }
      });

      scope.goToBill = function(billId) {
        scope.location.path('bill/' + billId);
      };
    },
  };
};
