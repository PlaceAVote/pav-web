module.exports = function($filter) {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_tax_multi.html',
    link: function(scope, el, attr) {
      scope.$watch('question', function(n, o) {
        if(n !== undefined) {
          scope.question.sliderConfig = {
            showSelectionBar: true,
            ceil: scope.question.range.max,
            minRange: 0,
            step: scope.question.range.step,
            hideLimitLabels: true,
            translate: function(value) {
              return $filter('currency')(value);
            },
          };
        }
      });
    },
  };
};
