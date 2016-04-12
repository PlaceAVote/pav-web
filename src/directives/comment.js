module.exports = function($compile, commentService, $anchorScroll, $timeout, $location, $window) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comment: '=',
      parent: '=',
    },
    templateUrl: 'partials/comments/comments.html',
    link: function(scope, element, attrs, controllerAs) {
      scope.commentService = commentService;
      scope.timeout = $timeout;
      scope.location = $location;
      scope.window = $window;

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

