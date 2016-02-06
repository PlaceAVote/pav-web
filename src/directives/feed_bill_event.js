module.exports = function($location) {
  return {
    restrict: 'E',
    scope: {
      bill: '=',
    },
    templateUrl: 'partials/directives/feed_bill_event.html',
    link: function(scope, el, attr) {
      scope.location = $location;
    }
  };
};
