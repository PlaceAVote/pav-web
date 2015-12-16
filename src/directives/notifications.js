module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      notifications: '=',
      readEvent: '&',
    },
    templateUrl: 'partials/notifications.html'
  };
};
