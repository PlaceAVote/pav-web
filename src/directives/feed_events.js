var feedEventsDirective = function() {
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
module.exports = feedEventsDirective;
