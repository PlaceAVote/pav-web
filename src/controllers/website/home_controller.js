var AuthorizeController = require('../autherize_controller.js');
function HomeController($scope, $location, $anchorScroll, userService, $rootScope, authService) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
	this.email = false;
	this.mobileemail = true;
  this.userService = userService;
  this.location = $location;
  this.rs = $rootScope || {};
  this.rs.inApp = false;
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
  var that = this;
  this.userService.loginWithFacebook(function(err, response){
    if (err) {
      if (err.status === 999) {
        that.loaded = true;
        return that.location.path('/');
      }
      that.rs.facebookSignUp = true;
      return that.location.path('/onboarding');
    } else {
      that.userService.getUserProfile('me', function(err, result) {
        if (err) {
          return;
        }
        if (result) {
          that.rs.user = result;
          that.rs.inApp = true;
          that.rs.notLoggedIn = false;
          that.location.path('/feed');
        }
      });
    }
  });
};

module.exports = HomeController;
