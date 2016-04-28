module.exports = function($location) {
  return {
    restrict: 'E',
    scope: {
      unread: '<',
      open: '<',
      notifications: '<',
      readEvent: '&',
      scrollTrigger: '&',
      scroll: '=',
    },
    templateUrl: 'partials/notifications.html',
    link: function(scope, el, attr) {

      el[0].onmousewheel = function(e) {
        window.scrollTo(0, scope.scrollPos);
      };

      scope.location = $location;
      scope.$watch('open', function(n) {
        if (n) {
          scope.scrollPos = window.scrollY;
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
