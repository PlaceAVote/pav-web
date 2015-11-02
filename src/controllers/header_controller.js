function HeaderCtrl($scope, $location, authService) {
  $scope = $scope || {};
  this.authService = authService;
  $scope.userStatus = this.authService.getAccessToken();
  this.location = $location;
 this.btest = function() {
 	console.log(this.userStatus);
 };
}

HeaderCtrl.prototype.go = function(hash) {
	this.location.path(hash);
};

module.exports = HeaderCtrl;