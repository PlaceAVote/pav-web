module.exports = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_comments.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};
