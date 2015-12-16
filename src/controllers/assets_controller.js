AssetsController = function($scope, $routeParams, $location) {
	$scope = $scope || {};
	$scope.assets = this;
	this.location = $location;
	// this.title = 'Place A Vote';
	// this.css = 'css/web.css';
	// this.paths = {
	// 	website: ['#/', '#/contact', '#/faq', '#/team','#/press','#/terms-of-service-and-privacy-policy']
	// }
	// console.log(this.paths.website);
	// $scope.$on("$routeChangeSuccess", function() {
	// 	console.log($scope.assets.paths.website.indexOf(this.location.hash));
	// 	if($scope.assets.paths.website.indexOf(this.location.hash) == -1) {
	// 		$scope.assets.css = 'css/styles.css';
	// 	} else {
	// 		$scope.assets.css = 'css/web.css';
	// 	}
	// });
}

// AssetsController.prototype.changePath = function() {
// 	console.log(this.paths.website);
// 	return;
// }

module.exports = AssetsController;