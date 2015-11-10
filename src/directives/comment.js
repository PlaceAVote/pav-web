module.exports = function($compile, commentService) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      comment: '='
    },
    templateUrl: 'partials/comments.html',
    link: function (scope, element, attrs) {
      console.log(scope);
      scope.commentService = commentService;
      if (angular.isArray(scope.comment.replies)) {
        element.append("<div class='comment-container comment-reply' ng-show='comment.showChildren'><comments comments='comment.replies'></comments></div>");
         var html = element.html();
        element.contents().remove();
        element.html(html);
        $compile(element.contents())(scope)
      }
    }
  }
};

