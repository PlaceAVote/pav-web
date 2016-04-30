module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      events: '<',
      refresh: '=',
      scroll: '=',
      message: '=',
      eventFilter: '<'
    },
    templateUrl: 'partials/feed/feed_events.html',
    link: function(scope, el, attr) {
      scope.size = '200';
      // console.log('widnow', window);
      // window.onscroll = function() {
      //   console.log('widnow', window.outerHeight);
      // }
    }
  };
};
