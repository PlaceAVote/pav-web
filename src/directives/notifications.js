module.exports = function($location) {
  return {
    restrict: 'E',
    // replace: true,
    scope: {
      unread: '=',
      open: '=',
      notifications: '=',
      readEvent: '&',
      scrollTrigger: '&',
      scroll: '=',
    },
    templateUrl: 'partials/notifications.html',
    link: function(scope, el, attr) {
      // scope.isClosed = true;
      // var
      el[0].onmousewheel = function(e) {
         window.scrollTo(0, scope.scrollPos);
      };

      scope.location = $location;
      scope.$watch('open', function(n) {
        if (n) {
          scope.scrollPos = window.scrollY;
        }
      });


      // scope.notifications = [];
      // scope.$watchCollection('data', function(newValue, oldValue) {
      //   if (oldValue && !newValue) {
      //     scope.notifications = [];
      //   }
      //   if (newValue) {
      //     if (newValue.hasOwnProperty('results')) {
      //       for (var i = 0; i < newValue.results.length; i++) {
      //         scope.notifications.push(new Notification(newValue.results[i]));
      //       }
      //     }
      //   }
      // });

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
