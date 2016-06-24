var PAV = window.PAV || {};
var billInfo = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_info.html',
    link: function(scope, el, attr) {
      scope.openPdf = function() {
        window.open(scope.$parent.bill.body.billData.last_version.urls.pdf);
      };

      scope.locaation = $location;
    },
  };
};

PAV.billInfoDirective = billInfo;
module.exports = billInfo;
