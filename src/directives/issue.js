module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      issue: '=',
    },
    templateUrl: 'partials/directives/issue.html',
  };
};
