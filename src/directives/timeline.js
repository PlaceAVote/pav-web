module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      timeline: '=',
      profile: '=',
    },
    templateUrl: 'partials/timeline.html',
  };
};
