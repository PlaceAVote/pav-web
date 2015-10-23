function HeaderCtrl($scope, $location, userService) {
  $scope = $scope || {};
  this.userService = userService;
}

module.exports = HeaderCtrl;