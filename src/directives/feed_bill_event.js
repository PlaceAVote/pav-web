var tweet = require('../models/tweet.js');

module.exports = function($location, facebook) {
  return {
    restrict: 'E',
    scope: {
      bill: '<',
    },
    templateUrl: 'partials/feed/feed_bill_event.html',
    link: function(scope, el, attr) {
      scope.location = $location;
      scope.facebook = facebook;
      var rootHref;

      scope.$watch('bill', function(newValue, oldValue) {
        if (newValue) {
          if ($location.$$host === 'beta.placeavote.com') {
            rootHref = 'https://beta.placeavote.com';
          }

          if ($location.$$host === 'dev.placeavote.com' || $location.$$host === 'localhost') {
            rootHref = 'http://dev.placeavote.com';
          }

          if ($location.$$host === 'placeavote.com') {
            rootHref = 'https://www.placeavote.com';
          }
          scope.billLocationFacebook = rootHref + '/#!/bill/' + scope.bill.bill_id;
          scope.billLocation = encodeURIComponent(rootHref + '/#!/bill/') + scope.bill.bill_id;
        }
      });

      scope.getLocation = function() {
        var t = tweet();
        return t.generateLink(scope.billLocation);
      };

      scope.getShareMessage = function() {
        var t = tweet();
        return t.generateMessage('Check out this bill @placeavote');
      };

      scope.shareToFacebook = function() {
        scope.facebook.share(scope.billLocationFacebook);
      };

    },
  };
};
