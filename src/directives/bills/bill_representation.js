module.exports = function($location) {
  return {
    restict: 'E',
    scope: {
      demographics: '=',
      shareToFacebook: '&',
      shareToTwitter: '&',
    },
    templateUrl: 'partials/bills/bill_representation.html',
  };
};
