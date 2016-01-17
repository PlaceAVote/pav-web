module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      user: '=',
      profile: '=',
    },
    templateUrl: 'partials/banner.html',
  };
};
