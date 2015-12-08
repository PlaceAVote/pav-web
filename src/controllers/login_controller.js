var AuthorizeController = require('./autherize_controller.js');

function LoginCtrl($scope, $location, userService, authService, $rootScope) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
  $scope = $scope || {};
  this.rs = $rootScope || {};
  this.userService = userService;
  $scope.login = this;
  this.location = $location;
  this.forgot = false;
  this.passwordSent = false;
  this.rs.loggedIn = false;

  this.user = {
    email: '',
    emailValid: true,
    password: '',
    passwordValid: true
  };
}

LoginCtrl.prototype.loginWithFacebook = function(){
  var that = this;
  this.userService.loginWithFacebook(function(err, response){
    if(err){
      that.location.path("/onboarding");
    }
    else {
      that.rs.loggedIn = true;
      that.location.path("/feed");
    }
  });
};

LoginCtrl.prototype.validate = function(u, hash) {
  var email = u.email;
  var password = u.password;
  this.user.emailValid = this.emailValidation(email);
  this.user.passwordValid = this.passwordValidation(password);
  if(this.user.emailValid && this.user.passwordValid) {
    this.userService.createUser(email, password);
    this.location.path(hash);
  }

};

LoginCtrl.prototype.login = function(u, hash) {
  var that = this;
  var email = u.email;
  var password = u.password;
  this.user.emailValid = this.emailValidation(email);
  this.user.passwordValid = this.passwordValidation(password);
  if(this.user.emailValid && this.user.passwordValid) {
    this.userService.login({email: email, password: password}, function(err, response){
      if (err) {
        if(err.status === 401){
          that.forgot = true;
        }
      } else {
        that.rs.loggedIn = true;
        that.location.path("/feed");
      }
    });
  }
};

LoginCtrl.prototype.emailValidation = function(email) {
  var e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return e.test(email);
};

LoginCtrl.prototype.passwordValidation = function(password) {
  var p = /^(?=.*\d)(?=.*[A-Z])(.{8,15})$/;
  return p.test(password);
};

module.exports = LoginCtrl;
