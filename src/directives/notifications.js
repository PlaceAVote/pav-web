var Notification = require('../models/notification.js');

module.exports = function($location) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      unread: '=',
      data: '=',
      notifications: '=',
      readEvent: '&',
    },
    templateUrl: 'partials/notifications.html',
    link: function(scope) {
      scope.location = $location;
      scope.notifications = [];
      scope.$watch('data', function(newValue, oldValue) {
        if (oldValue && !newValue) {
          scope.notifications = [];
        }
        if (newValue) {
          if (newValue.hasOwnProperty('results')) {
            for (var i = 0; i < newValue.results.length; i++) {
              scope.notifications.push(new Notification(newValue.results[i]));
            }
          }
        }
      });

      scope.$watch('unread', function(newValue, oldValue) {
        if (newValue > oldValue) {
          scope.notifications.unshift(new Notification(scope.$parent.header.newNotification));
        }
      });

      scope.hideNotifications = function() {
        scope.$parent.header.showNotifications = false;
      };
    },
  };
};
