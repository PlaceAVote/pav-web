var PAV = window.PAV || {};
var trendsActivityFeed = function() {
  return {
    restrict: 'E',
    scope: {
      feed: '<',
    },
    templateUrl: 'partials/feed/trends_activity_feed.html',
  };
};
PAV.trendsActivityFeedDirective = trendsActivityFeed;
module.exports = trendsActivityFeed;
