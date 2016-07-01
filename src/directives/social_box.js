module.exports = function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/sharing/social_box.html',
    transclude: true,
    scope: {
      demographics: '=',
      shareToFacebook: '&',
      shareToTwitter: '&',
    },
  };
};
