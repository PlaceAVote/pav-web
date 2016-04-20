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
    link: function(scope, el, attr) {
      console.log(scope);
      scope.$watch('events', function(o, n) {
        console.log(o);
        console.log(n);
      });
    },
  };
};
