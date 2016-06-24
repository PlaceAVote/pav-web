var PAV = window.PAV || {};
var dragAndDropDirective = function() {
  return {
    restrict: 'E',
    scope: {
      question: '=',
    },
    templateUrl: 'partials/wizard_drag_and_drop.html',
  };
};
PAV.dragAndDropDirective = dragAndDropDirective;
module.exports = dragAndDropDirective;
