var taxMultiDirective = function($filter, $location, $anchorScroll) {
  return {
    restrict: 'E',
    scope: {
      question: '=',
      answer: '&',
    },
    templateUrl: 'partials/wizard_tax_multi.html',
    link: function(scope, el, attr) {
      scope.location = $location;
      scope.anchorScroll = $anchorScroll;
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
        if (scope.question.zip === '') {
          scope.errorMessage = true;
          scope.anchorScroll('zipCode');
          return;
        }
        scope.location.path('bill/' + billId);
      };
    },
  };
};
module.exports = taxMultiDirective;
