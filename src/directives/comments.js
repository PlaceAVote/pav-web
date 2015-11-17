module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comments: '='
    },
    template: "<comment ng-repeat='comment in comments' comment='comment'></comment>",
  };
};