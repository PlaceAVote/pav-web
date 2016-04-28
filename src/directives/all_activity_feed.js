module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/feed/all_activity_feed.html',
  };
};
