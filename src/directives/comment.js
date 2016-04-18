module.exports = function($compile, commentService, $anchorScroll, $timeout, $location, $window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comment: '=',
      parent: '=',
      feed: '=',
    },
    templateUrl: 'partials/comments/comments.html',
    link: function(scope, element, attrs, controllerAs) {
      scope.commentService = commentService;
      scope.timeout = $timeout;
      scope.location = $location;
      scope.window = $window;

      // This enables bill title to display if comment is for feed.
      scope.$watch('feed', function(o,n) {
        if (n) {
          scope.feed = n;
        }
      });
      if (angular.isArray(scope.comment.replies)) {
        element.append('<div class=\'comment-container comment-reply\' ng-show=\'comment.showChildren\'><comments comments=\'comment.replies\'></comments></div>');
        var html = element.html();
        element.contents().remove();
        element.html(html);
        $compile(element.contents())(scope);

        if (scope.comment.selected) {
          $timeout(function() {
            $location.hash('comment-selected');
            $anchorScroll();
            $location.hash('');
          }, 1000);
        }
      }
    },
  };
};

