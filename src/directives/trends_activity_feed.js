module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/trends_activity_feed.html',
  };
};
