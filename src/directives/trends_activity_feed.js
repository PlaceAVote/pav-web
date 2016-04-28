module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/feed/trends_activity_feed.html',
  };
};
