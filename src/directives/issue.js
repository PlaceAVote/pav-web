module.exports = function($location, issueService) {
  return {
    restrict: 'E',
    scope: {
      issue: '=',
    },
    templateUrl: 'partials/directives/issue.html',
    link: function(scope, el, attr) {
      scope.location = $location;
      scope.eResponse = function(id, emo, issue) {
        if (emo === issue.emotional_response) {
          issueService.deleteIssueResponse(id, emo, function(err, res) {
            if (err) {
              return;
            }
            if (res) {
              issue.emotional_response = 'none';
              return;
            }
          });
        } else {
          issueService.setIssueResponse(id, emo, function(err, res) {
            if (err) {
              return;
            }
            if (res) {
              issue.emotional_response = res.emotional_response;
            }
          });
        }
      };
    },
  };
};
