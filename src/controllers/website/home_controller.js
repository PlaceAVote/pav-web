var AuthorizeController = require('../autherize_controller.js');
function HomeController($scope, $location, $anchorScroll, userService, $rootScope, authService) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
	this.email = false;
	this.mobileemail = true;
  this.userService = userService;
  this.location = $location;
  this.rs = $rootScope || {};
	this.gotoAnchor = function(x) {
      var newHash = '#' + x;
      if ($location.hash() !== newHash) {
        $location.hash(x);
      } else {
        $anchorScroll();
      }
    };

}

HomeController.prototype.loginWithFacebook = function(){
  console.log('listening');
  var that = this;
  this.userService.loginWithFacebook(function(err, response){
    if(err){
      that.location.path("/onboarding");
    }
    else {
      that.rs.user = that.userService.getUser();
      that.rs.loggedIn = true;
      that.location.path("/feed");
    }
  });
};

module.exports = HomeController;