module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      events: '<',
      refresh: '=',
      scroll: '=',
      message: '=',
    },
    templateUrl: 'partials/feed/feed_events.html',
  };
};
