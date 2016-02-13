module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      events: '=',
      refresh: '=',
      scroll: '=',
      message: '=',
    },
    templateUrl: 'partials/directives/feed_events.html',
  };
};
