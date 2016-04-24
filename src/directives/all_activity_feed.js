module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '=',
    },
    templateUrl: 'partials/all_activity_feed.html',
  };
};
