module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      issue: '<',
    },
    templateUrl: 'partials/issues/issue_modal.html',
    link: function(scope, el) {
      console.log(scope, el);
    },
  };
};
