module.exports = function($location) {
  return {
    restict: 'E',
    scope: {
      ranges: '=',
      gender: '=',
      ico: '=',
      total: '=',
    },
    templateUrl: 'partials/bills/bill_gender_breakdown.html',
  };
};
