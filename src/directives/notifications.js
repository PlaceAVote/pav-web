module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      notifications: '=',
      readEvent: '&',
    },
    // controller: 'HeaderCtrl as header',
    templateUrl: 'partials/notifications.html'
  };
};
