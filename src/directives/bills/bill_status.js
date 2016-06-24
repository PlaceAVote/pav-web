var PAV = window.PAV || {};
var billStatus = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_status.html',
  };
};

PAV.billStatusDirective = billStatus;
module.exports = billStatus;
