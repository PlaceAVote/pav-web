module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      events: '=',
    },
    templateUrl: 'partials/directives/feed_events.html',
  };
};
