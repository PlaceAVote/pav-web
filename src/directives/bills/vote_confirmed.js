module.exports = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_vote_confirmed.html',
    link: function(scope) {
      scope.location = function(url) {
        $location.path(url);
      }
    }
  };  
};
