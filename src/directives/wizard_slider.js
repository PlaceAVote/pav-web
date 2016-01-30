module.exports = function($timeout) {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_slider.html',
    link: function(scope, el, ettr) {
      scope.$watch('question', function(n, o) {
        if (n !== undefined) {
          scope.question.sliderConfig = {
            showSelectionBar: true,
            hideLimitLabels: true,
            ceil: scope.question.answers.length - 1,
            minRange: 0,
            translate: function(value) {
              return '';
            },
          };
          $timeout(function() {
            scope.$broadcast('rzSliderForceRender');
          });
        }
      });
    },
  };
};
