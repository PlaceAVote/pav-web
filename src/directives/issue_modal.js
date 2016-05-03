module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      issue: '<',
    },
    templateUrl: 'partials/issues/issue_modal.html',
  };
};

// ng-if="issue.issue_selected"
