function HomeCtrl($scope, $location, $anchorScroll) {
	this.email = false;
	this.mobileemail = true;
	this.gotoAnchor = function(x) {
      var newHash = '#' + x;
      if ($location.hash() !== newHash) {
        $location.hash(x);
      } else {
        $anchorScroll();
      }
    };
}

module.exports = HomeCtrl;