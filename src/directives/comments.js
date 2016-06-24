var PAV = window.PAV || {};
var commentsDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comments: '<',
    },
    template: '<comment ng-repeat=\'comment in comments\' comment=\'comment\'></comment>',
  };
};
PAV.commentsDirective = commentsDirective;
module.exports = commentsDirective;
