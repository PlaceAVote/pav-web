module.exports = function($compile, commentService, $anchorScroll, $timeout, $location, $window, userService) {
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
      scope.userService = userService;

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


      // Edit Method
      if (scope.comment) {
        scope.original = scope.comment.body;
        scope.edit = scope.userService.isUserMe(scope.comment.author);
      }


      scope.cancelEdit = function() {
        scope.comment.body = scope.original;
        scope.showEditTools = false;
      };
        
      scope.editComment = function() {

        if (scope.editLoading) {
          return;
        }

        scope.editLoading = true;

        scope.commentService.edit(scope.comment.id, scope.comment.body, function(err, res) {
          scope.editLoading = false;

          if (err) {
            scope.setAlertMessage('There was a problem editing your comment', false);
          }

          if (res) {
            console.log(res);
            scope.showEditTools = false;
            scope.original = res.body;
            scope.setAlertMessage('Your comment has been edited', true);
          }
        });

      };

      scope.cancelDelete = function() {
        scope.showDelete = false;
      };


      scope.deleteComment = function() {

        if (scope.deleteLoading) {
          return;
        }

        scope.deleteLoading = true;

        scope.commentService.deleteComment(scope.comment.id, function(err, res) {
          scope.deleteLoading = false;
          scope.showDelete = false;

          if (err) {
            scope.setAlertMessage('Sorry, there was a problem deleting your comment', false);
          }

          if (res) {
            scope.setAlertMessage('Comment deleted.', false);
            scope.timeout(function() {
              scope.comment.commentDelete = true;
              // scope.$apply();
              return;
            }, 1000);

          }

        });

      };


      scope.setAlertMessage = function(message, success) {
        scope.alertMessage = {
            visible: true,
            message: message,
            success: success,
          };

        scope.timeout(function() {
          scope.alertMessage.visible = false;
        }, 3000);
      };

    },
  };
};

