var PAV = window.PAV || {};
function MenuController($scope, $location, $routeParams) {
	$scope.menu = this;
	this.menu = true;
	this.stickyNav = false;
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
}
PAV.menuController = MenuController;
module.exports = MenuController;
