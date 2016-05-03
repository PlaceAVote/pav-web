var tweet = require('../models/tweet.js');
var Issue = require('../models/issue.js');

module.exports = function($location, issueService, facebook, $window, userService, $timeout, $compile) {
  return {
    restrict: 'E',
    scope: {
      issue: '<',
      example: '<',
      closable: '&',
      follow: '<',
      profile: '<',
    },
    templateUrl: 'partials/directives/issue.html',
    link: function(scope, el, attr, controller) {
      var that = this;
      scope.context = {};

      scope.location = $location;

      scope.issueService = issueService;

      scope.userService = userService;

      scope.timeout = $timeout;

      scope.user = {};

      if (scope.issue) {
        scope.original = scope.issue.comment_sanitized;
        scope.user.edit = scope.userService.isUserMe(scope.issue.user_id);
        scope.user.showEditTools = false;
        scope.user.showDeleteTools = false;
      }

      if (attr.$attr.single) {
        scope.context.single = true;
        scope.$watchCollection('issue', function(n, o) {
          if (n) {
            scope.context.isUserMe = scope.userService.isUserMe(scope.issue.user_id);
            scope.original = scope.issue.comment_sanitized;
            scope.user.showEditTools = false;
            scope.user.showDeleteTools = false;
          }
        });
      }

      scope.eResponse = function(id, emo, issue) {

        var that = this;

        if (scope.example) {
          return;
        }

        if (this.loading) {
          return;
        }

        this.loading = true;

        if (emo === issue.emotional_response) {
          scope.issueService.deleteIssueResponse(id, emo, function(err, res) {
            if (err) {
              that.loading = false;
              return;
            }
            if (res) {
              if (!that.loading) {
                that.loading = false;
                return;
              }
              if (issue[issue.emotional_response + '_responses'] <= 0) {
                return;
              }
              issue[issue.emotional_response + '_responses']--;
              issue.emotional_response = 'none';
              that.loading = false;
              return;
            }
          });
        }

        if (emo !== issue.emotional_response) {
          scope.issueService.setIssueResponse(id, emo, function(err, res) {
            if (err) {
              that.loading = false;
              return;
            }
            if (res) {
              if (issue.emotional_response !== 'none') {
                if (issue[issue.emotional_response + '_responses'] <= 0) {
                  return;
                }
                issue[issue.emotional_response + '_responses']--;
              }
              issue.emotional_response = res.emotional_response;
              issue[res.emotional_response + '_responses']++;
              that.loading = false;
              return;
            }
          });
        }
      };

      var rootHref = 'https://placeavote.com';
      if (scope.issue) {
        scope.issueLocationFacebook = rootHref + '/#!/issue/' + scope.issue.short_issue_id;
        scope.issueLocation = encodeURIComponent(rootHref + '/#!/issue/') + scope.issue.short_issue_id;
      }

      scope.$watch('issue', function(newValue, oldValue) {
        if (newValue) {
          if ($location.$$host === 'beta.placeavote.com') {
            rootHref = 'https://beta.placeavote.com';
            scope.issueLocationFacebook = rootHref + '/#!/issue/' + scope.issue.short_issue_id;
            scope.issueLocation = encodeURIComponent(rootHref + '/#!/issue/') + scope.issue.short_issue_id;
          }

          if ($location.$$host === 'dev.placeavote.com' || $location.$$host === 'localhost') {
            rootHref = 'http://dev.placeavote.com';
            scope.issueLocationFacebook = rootHref + '/#!/issue/' + scope.issue.short_issue_id;
            scope.issueLocation = encodeURIComponent(rootHref + '/#!/issue/') + scope.issue.short_issue_id;
          }

          if ($location.$$host === 'placeavote.com') {
            rootHref = 'https://www.placeavote.com';
            scope.issueLocationFacebook = rootHref + '/#!/issue/' + scope.issue.short_issue_id;
            scope.issueLocation = encodeURIComponent(rootHref + '/#!/issue/') + scope.issue.short_issue_id;
          }
        }
      });

      scope.getShareMessage = function() {
        var t = tweet();
        return t.generateMessage('Check out this issue @placeavote');
      };

      scope.facebook = facebook;
      scope.shareToFacebook = function() {
        scope.facebook.share(scope.issueLocationFacebook);
      };



      // Issue Editing

      scope.cancelIssue = function() {
        scope.issue.comment_sanitized = scope.original;
        scope.user.showEditTools = false;
      };

      scope.editIssue = function() {

        var body = {comment: scope.issue.comment_sanitized};

        if (scope.editLoading || scope.original === scope.issue.comment_sanitized) {
          return;
        }

        scope.editLoading = true;
        scope.issueService.editIssue(scope.issue.issue_id, body, function(err, res) {

          scope.editLoading = false;

          if (err) {
            scope.setAlertMessage('There was a problem updating your Issue', false);
          }

          if (res) {
            res = new Issue(res);
            scope.user.showEditTools = false;
            scope.issue.comment_sanitized = res.comment_sanitized;
            scope.issue.comment = res.comment;
            scope.setAlertMessage('Your message has been edited', true);
          }

        });

      };


      scope.cancelDelete = function() {
        scope.user.showDelete = false;
      };


      scope.deleteIssue = function() {

        if (scope.deleteLoading) {
          return;
        }

        scope.deleteLoading = true;

        scope.issueService.deleteIssue(scope.issue.issue_id, function(err, res) {
          scope.deleteLoading = false;
          scope.user.showDelete = false;

          if (err) {
            scope.setAlertMessage('There was a problem deleting your issue', false);
          }

          if (res) {
            scope.setAlertMessage('Issue deleted.', false);
            scope.timeout(function() {
              scope.issue.issueDelete = true;
              scope.$apply();
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


      // Issues Modal and Comments

      scope.testClick = function() {
        el.append('<issue-modal issue="issue"></issue-modal>');
        var html = el.html();
        el.contents().remove();
        el.html(html);
        $compile(el.contents())(scope);
      }


    },
  };
};
