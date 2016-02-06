module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      events: '=',
      refresh: '=',
    },
    templateUrl: 'partials/directives/feed_events.html',
  };
};
