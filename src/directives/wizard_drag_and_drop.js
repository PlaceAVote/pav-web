var dragAndDropDirective = function() {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_drag_and_drop.html',
  };
};
module.exports = dragAndDropDirective;
