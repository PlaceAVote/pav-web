var PAV = window.PAV || {};
var bannerDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=',
      profile: '=',
      followers: '=',
      following: '=',
      toggle: '=',
    },
    templateUrl: 'partials/banner.html',
    link: function(scope, el, attr) {
      scope.toggleFollowers = function() {
        if (scope.toggle) {
          if (scope.following) {
            scope.followers = true;
            scope.following = false;
          } else {
            scope.following = false;
            scope.followers = false;
            scope.toggle = false;
          }
        } else {
          scope.toggle = true;
          scope.following = false;
          scope.followers = true;
        }
      };
      scope.toggleFollowing = function() {
        if (scope.toggle) {
          if (scope.followers) {
            scope.following = true;
            scope.followers = false;
          } else {
            scope.followers = false;
            scope.following = false;
            scope.toggle = false;
          }
        } else {
          scope.toggle = true;
          scope.followers = false;
          scope.following = true;
        }
      };
    },
  };
};
PAV.bannerDirective = bannerDirective;
module.exports = bannerDirective;
