var issueModalDirective = function($location, $timeout, issueService, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      issue: '<',
    },
    templateUrl: 'partials/issues/issue_modal.html',
    link: function(scope, el) {
      scope.parent = el;
      scope.issueService = issueService;
      scope.location = $location;
      scope.timeout = $timeout;
      scope.commentOrder = 'highest-score';
      scope.img_url = $rootScope.user.img_url;
      scope.postComment = function() {
        var that = this;

        if (!issueService) {
          return;
        }

        var scriptExp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        var objectExp = /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi;

        if (scriptExp.test(this.commentBody) || objectExp.test(this.commentBody)) {
          scope.commentError('Sorry, there was an error.');
          console.log('caught');
          scope.commentBody = '';
          return;
        }

        if (this.postingComment) {
          return;
        }

        scope.postingComment = true;
        scope.issueService.postComment(scope.issue.issue_id, scope.commentBody, function(err, result) {
          scope.postingComment = false;
          if (err) {
            scope.postCommentError = true;
            if (err.message === 'Login Required') {
              scope.location.path('/');
            }
          } else if (result) {
            scope.issue.comment_count += 1;
            scope.commentMessage = false;
            scope.commentBody = undefined;
            scope.fetchComments();
          }
        });
      };

      scope.commentError = function(message) {
        var that = this;
        scope.errorMessage = message;
        scope.timeout(function() {
          scope.errorMessage = '';
        }, 2000);
      };

      scope.fetchComments = function(order) {
        if (scope.fetchingComments) {
          return;
        }

        if (order) {
          scope.commentOrder = order;
        }

        scope.fetchingComments = true;
        scope.issueService.fetchComments(scope.issue.issue_id, scope.commentOrder, undefined, undefined, function(err, res) {
          scope.fetchingComments = false;
          if (res) {
            scope.comments = res.comments;
            scope.lastComment = res.lastComment;
          }

          if (err) {
            scope.commentError('Sorry there was an error');
          }

        });
      };

      scope.commentsCheck = function() {

        if (scope.checkingComments || !scope.lastComment) {
          return;
        }

        scope.checkingComments = true;
        scope.fetchingComments = true;

        scope.issueService.fetchComments(scope.issue.issue_id, scope.commentOrder, scope.lastComment, undefined, function(err, res) {
          scope.checkingComments = false;
          scope.fetchingComments = false;
          if (res) {
            scope.comments.push.apply(scope.comments, res.comments);
            scope.lastComment = res.lastComment;
          }

          if (err) {
            scope.commentError('Sorry there was an error');
          }

        });
      };

      scope.fetchComments();

    },
  };
};
module.exports = issueModalDirective;
