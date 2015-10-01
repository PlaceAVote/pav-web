function MenuCtrl($scope, $location) {
	this.menu = true;

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

module.exports = MenuCtrl;