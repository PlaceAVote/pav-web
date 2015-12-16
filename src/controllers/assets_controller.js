AssetsController = function($scope, $routeParams, $location) {
	$scope = $scope || {};
	$scope.assets = this;
	this.location = $location;
	this.title = 'Place A Vote';
	this.css = 'css/web.css';
	this.paths = {
		website: ['#/', '#/contact', '#/faq', '#/team', '#/terms-of-service-and-privacy-policy']
	}
	// console.log(this.paths.website);
	$scope.$on("$routeChangeSuccess", function() {
		console.log(location.hash.find($scope.assets.paths.website));
	});
}

AssetsController.prototype.changePath = function() {
	console.log(this.paths.website);
	return;
}

module.exports = AssetsController;