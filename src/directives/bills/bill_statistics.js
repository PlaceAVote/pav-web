var billStatistics = function($location) {
  return {
    restict: 'E',
    scope: {
      demographics: '=',
      shareToFacebook: '&',
      shareToTwitter: '&',
    },
    templateUrl: 'partials/bills/bill_statistics.html',
  };
};

module.exports = billStatistics;
