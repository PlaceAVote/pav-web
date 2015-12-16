function MenuController($scope, $location, $routeParams) {
	$scope.menu = this;
	this.menu = true;
	this.paths = {
		website: ['#/', '#/contact', '#/faq', '#/team', '#/press','#/terms-of-service-and-privacy-policy']
	}
	this.mobile = function() {
		that = this;
		if (that.menu) {
			that.menu = false;
			return that.menu;
		} else {
			that.menu = true;
			return that.menu;
		}
	};

	$scope.$on("$routeChangeSuccess", function() {
		console.log(this.location);
		if($scope.menu.paths.website.indexOf(this.location.hash) == -1) {
			$scope.menu.hide = true;
		} else {
			$scope.menu.hide = false;
		}
	});
}

module.exports = MenuController;