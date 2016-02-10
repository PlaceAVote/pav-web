module.exports = function($location, issueService) {
  return {
    restrict: 'E',
    scope: {
      issue: '=',
    },
    templateUrl: 'partials/directives/issue.html',
    link: function(scope, el, attr) {
      scope.location = $location;
      scope.issueService = issueService;
      scope.eResponse = function(id, emo, issue) {
        var that = this;
        
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
    },
  };
};
