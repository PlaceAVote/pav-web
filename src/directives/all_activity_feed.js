var PAV = window.PAV || {};
var allActivityFeedDirective = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/feed/all_activity_feed.html',
  };
};
PAV.allActivityFeedDirective = allActivityFeedDirective;
module.exports = allActivityFeedDirective;
