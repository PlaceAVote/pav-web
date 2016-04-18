module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      comment: '=',
    },
    templateUrl: 'partials/directives/feed_comment_event.html',
    link: function(scope) {
      scope.feed = true;
    },
  };
};
