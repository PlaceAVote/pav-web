var PAV = window.PAV || {};
var billStatistics = function($location) {
  return {
    restict: 'E',
    templateUrl: 'partials/bills/bill_statistics.html',
  };
};

PAV.billStatisticsDirective = billStatistics;
module.exports = billStatistics;
