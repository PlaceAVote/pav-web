module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      comment: '<',
    },
    templateUrl: 'partials/feed/feed_comment_event.html',
    link: function(scope) {
      scope.feed = true;
    },
  };
};
