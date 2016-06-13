module.exports = function($location) {
  return {
    restict: 'E',
    scope: {
      ranges: '=',
      gender: '=',
      ico: '=',
    },
    templateUrl: 'partials/bills/bill_gender_breakdown.html',
  };
};
