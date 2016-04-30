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
    link: function(scope, el, attr) {
      // console.log(scope.events);
      scope.$watch('events', function(n, o) {
        console.log(scope.events);
      })
    }
  };
};
