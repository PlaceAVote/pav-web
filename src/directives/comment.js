module.exports = function($compile, commentService, $anchorScroll, $timeout, $location, $window, userService) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      comment: '<',
      parent: '<',
      feed: '<',
      modal: '<',
    },
    templateUrl: 'partials/comments/comments.html',
    link: function(scope, element, attrs) {
      scope.context = {};
      if (scope.comment.bill_id) {
        scope.context.type = 'bill';
        scope.context.id = scope.comment.bill_id;
      }

      if (scope.comment.issue_id) {
        scope.context.type = 'issue';
        scope.context.id = scope.comment.issue_id;
      }

      scope.commentService = commentService;
      scope.timeout = $timeout;
      scope.location = $location;
      scope.window = $window;
      scope.userService = userService;

      scope.clickUserName = function(path) {
        if (!scope || !scope.modal) {
          return $location.path(path);
        }
        scope.modal.removeClass('c-modal__wrapper c-modal__wrapper--active c-issue--modal');
        scope.modal.empty();
        angular.element(document.body).removeClass('c-modal__body--active');
        $location.path(path);
      };

      scope.$watch('feed', function(n,o) {
        if (n) {
          scope.feed = n;
        }
      });

      if (scope.comment.replies) {
        $compile('<div class="comment-container comment-reply" ng-if="comment.showChildren"><comments comments="comment.replies"></comments></div>')(scope, function(cloned, scope) {
          element.append(cloned);
        });


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
        scope.context.comment = scope.comment.body_sanitized;
        scope.commentService.edit(scope.comment.id, scope.context, function(err, res) {
          scope.editLoading = false;

          if (err) {
            scope.setAlertMessage('There was a problem editing your comment', false);
          }

          if (res) {
            scope.showEditTools = false;
            scope.comment = res;
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

        scope.commentService.deleteComment(scope.comment.id, scope.context, function(err, res) {
          scope.deleteLoading = false;
          scope.showDelete = false;

          if (err) {
            scope.setAlertMessage('Sorry, there was a problem deleting your comment', false);
          }

          if (res) {
            scope.setAlertMessage('Comment deleted.', false);
            scope.timeout(function() {
              scope.comment.comment_deleted = true;
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
