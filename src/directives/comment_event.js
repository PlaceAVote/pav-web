module.exports = function($compile, commentService, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comment: '=',
    },
    templateUrl: 'partials/comment_event.html',
    link: function(scope, element, attrs) {
      scope.commentService = commentService;
      scope.timeout = $timeout;
      if (angular.isArray(scope.comment.replies)) {
        element.append('<div class=\'comment-container comment-reply\' ng-show=\'comment.showChildren\'><comments comments=\'comment.replies\'></comments></div>');
        var html = element.html();
        element.contents().remove();
        element.html(html);
        $compile(element.contents())(scope);
      }
    },
  };
};

