module.exports = function($compile) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      comment: '='
    },
    templateUrl: 'partials/comments.html',
    link: function (scope, element, attrs) {
      if (angular.isArray(scope.comment.replies)) {
        element.append("<div class='comment-reply' ng-show='comment.showChildren'><comments comments='comment.replies'></comments></div>");
        $compile(element.contents())(scope)
      }
    }
  }
};

