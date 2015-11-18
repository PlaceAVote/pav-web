function LoginCtrl($scope, $location, userService, authService) {
  $scope = $scope || {};
  this.userService = userService;
  this.authService = authService;
  $scope.login = this;
  this.location = $location;
  this.forgot = false;
  this.passwordSent = false;

  this.user = {
    email: '',
    emailValid: true,
    password: '',
    passwordValid: true
  };
  this.auth();
}

LoginCtrl.prototype.auth = function() {
  var that = this;
  this.authService.validateToken(function(result){
    if(result) {
      that.location.path('/feed');
    }
  });
};

LoginCtrl.prototype.loginWithFacebook = function(){
  var that = this;
  this.userService.loginWithFacebook(function(err, response){
    if(err){
      that.location.path("/onboarding");
    }
    else {
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
  var p = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/;
  return p.test(password);
};

module.exports = LoginCtrl;
