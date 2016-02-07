module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      posted: '&',
    },
    templateUrl: 'partials/directives/issues_post.html',
  };
};
