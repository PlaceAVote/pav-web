var billSummary = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_summary.html',
    link: function(scope, el, attr) {
      scope.openPdf = function() {
        window.open(scope.$parent.bill.body.billData.last_version.urls.pdf);
      };

      scope.location = $location;
    },
  };
};
module.exports = billSummary;
