var tweet = require('../models/tweet.js');

module.exports = function($location, issueService, facebook, $window, userService, $timeout) {
  return {
    restrict: 'E',
    scope: {
      issue: '=',
      example: '=',
      closable: '&',
      follow: '=',
      profile: '=',
    },
    templateUrl: 'partials/directives/issue.html',
    link: function(scope, el, attr, controller) {

      if (attr.$attr.single) {
        scope.single = true;
      }

      scope.location = $location;

      scope.issueService = issueService;

      scope.userService = userService;

      scope.timeout = $timeout;


      if (scope.issue) {
        scope.original = scope.issue.comment;
        scope.edit = scope.userService.isUserMe(scope.issue.user_id);
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
        scope.issueLocationFacebook = rootHref + '/issue/' + scope.issue.short_issue_id;
        scope.issueLocation = encodeURIComponent(rootHref + '/issue/') + scope.issue.short_issue_id;

        scope.$watch('issue', function(newValue, oldValue) {
          if (newValue) {
            if ($location.$$host === 'beta.placeavote.com') {
              rootHref = 'https://beta.placeavote.com';
              scope.issueLocationFacebook = rootHref + '/issue/' + scope.issue.short_issue_id;
              scope.issueLocation = encodeURIComponent(rootHref + '/issue/') + scope.issue.short_issue_id;
            }

            if ($location.$$host === 'dev.placeavote.com' || $location.$$host === 'localhost') {
              rootHref = 'http://dev.placeavote.com';
              scope.issueLocationFacebook = rootHref + '/issue/' + scope.issue.short_issue_id;
              scope.issueLocation = encodeURIComponent(rootHref + '/issue/') + scope.issue.short_issue_id;
            }

            if ($location.$$host === 'placeavote.com') {
              rootHref = 'https://www.placeavote.com';
              scope.issueLocationFacebook = rootHref + '/issue/' + scope.issue.short_issue_id;
              scope.issueLocation = encodeURIComponent(rootHref + '/issue/') + scope.issue.short_issue_id;
            }
          }
        });
      }

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
        scope.issue.comment = scope.original;
        scope.showEditTools = false;
      };

      scope.editIssue = function() {

        var body = {comment: scope.issue.comment};

        if (scope.editLoading || scope.original === scope.issue.comment) {
          return;
        }

        scope.editLoading = true;
        scope.issueService.editIssue(scope.issue.issue_id, body, function(err, res) {

          scope.editLoading = false;

          if (err) {
            scope.setAlertMessage('There was a problem updating your Issue', false);
          }

          if (res) {
            scope.showEditTools = false;
            scope.original = res.comment;
            scope.setAlertMessage('Your message has been edited', true);
          }

        });

      };


      scope.cancelDelete = function() {
        scope.showDelete = false;
      };


      scope.deleteIssue = function() {

        if (scope.deleteLoading) {
          return;
        }

        scope.deleteLoading = true;

        scope.issueService.deleteIssue(scope.issue.issue_id, function(err, res) {
          scope.deleteLoading = false;
          scope.showDelete = false;

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


    },
  };
};
