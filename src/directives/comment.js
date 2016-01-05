module.exports = function($compile, commentService) {
  return {
    restrict: "E",
    replace: true,
    scope: {
      comment: '=',
      parent: '='
    },
    templateUrl: 'partials/comments.html',
    link: function (scope, element, attrs, controllerAs) {
      scope.commentService = commentService;
      
      if (angular.isArray(scope.comment.replies)) {
        // for (var i = 0; i < scope.comment.replies.length; i++) {
        //   if(scope.comment.replies[i].selected) {
        //     scope.comment.showChildren = true;
        //     console.log(element, element[0].nextSibling.previousSibling.childNodes[3].childNodes[1].attributes);
        //     element[0].nextSibling.previousSibling.childNodes[3].childNodes[1].click();
        //   } 
        // }
        element.append("<div class='comment-container comment-reply' ng-show='comment.showChildren'><comments comments='comment.replies'></comments></div>");
         var html = element.html();
        element.contents().remove();
        element.html(html);
        $compile(element.contents())(scope)
      }
    }
  }
};

