function HeaderCtrl($scope, $location, authService) {
  $scope = $scope || {};
  this.authService = authService;
  $scope.userStatus = this.authService.getAccessToken();
 this.btest = function() {
 	console.log(this.userStatus);
 };
}

module.exports = HeaderCtrl;