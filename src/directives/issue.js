var tweet = require('../models/tweet.js');

module.exports = function($location, issueService, facebook, $window) {
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
    link: function(scope, el, attr) {

      if (attr.$attr.single) {
        scope.single = true;
      }
      scope.location = $location;
      scope.issueService = issueService;
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

      if (scope.issue) {
        scope.issueLocationFacebook = $window.location.origin + '/#/issue/' + scope.issue.issue_id;
        scope.issueLocation = $window.location.origin + encodeURIComponent('/#/issue/') + scope.issue.issue_id;
      }

      scope.getShareMessage = function() {
        var t = tweet();
        return t.generateMessage('Check out this issue @placeavote');
      };

      scope.facebook = facebook;
      scope.shareToFacebook = function() {
        var t = tweet();
        scope.facebook.share(scope.issueLocationFacebook);
      };

    },
  };
};
