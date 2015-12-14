module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      notifications: '=',
    },
    templateUrl: 'partials/notifications.html'
  };
};
