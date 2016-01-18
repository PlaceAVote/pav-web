var AuthorizeController = require('./autherize_controller.js');

function LoginCtrl($scope, $location, userService, authService, $rootScope, $routeParams) {
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
    passwordValid: true,
  };

  $scope.$on('$routeChangeSuccess', function() {
    if (this.location.hash == '#/signup') {
      $scope.login.signup = true;
    }
  });
}

LoginCtrl.prototype.loginWithFacebook = function() {
  var that = this;
  this.userService.loginWithFacebook(function(err, response) {
    if (err) {
      if (err.status === 999) {
        return that.location.path('/');
      }
      return that.location.path('/onboarding');
    }
    that.rs.user = that.userService.getUser();
    that.rs.loggedIn = true;
    that.location.path('/feed');
  });
};

LoginCtrl.prototype.validate = function(u, hash) {
  var email = u.email;
  var password = u.password;
  this.user.emailValid = this.emailValidation(email);
  this.user.passwordValid = this.passwordValidation(password);
  if (this.user.emailValid && this.user.passwordValid) {
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
  if (!this.user.emailValid && !this.user.passwordValid) {
    return;
  }

  var validUser = {
    email: email,
    password: password,
  };

  this.userService.login(validUser, function(err, response) {
    console.log(err, response);
    if (err) {
      that.forgot = true;
      return;
    }
    that.userService.getUserProfile('me', function(err, result) {
      if (err) {
        return that.logout();
      }
      that.rs.user = result;
      that.rs.loggedIn = true;
      that.location.path('/feed');
    });
  });
};

LoginCtrl.prototype.logout = function() {
  this.rs.loggedIn = false;
  this.rs.user = {};
  AuthorizeController.logout({authorizer: this.authService, location: this.location});
};

LoginCtrl.prototype.emailValidation = function(email) {
  var e = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return e.test(email);
};

LoginCtrl.prototype.passwordValidation = function(password) {
  return true;
};

module.exports = LoginCtrl;
