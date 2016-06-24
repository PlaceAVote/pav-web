var PAV = window.PAV || {};
var billComments = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_comments.html',
    link: function(scope) {
      scope.location = $location;
    },
  };
};

module.exports = billComments;
PAV.billCommentsDirective = billComments;
