var allActivityFeedDirective = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/feed/all_activity_feed.html',
  };
};
module.exports = allActivityFeedDirective;
