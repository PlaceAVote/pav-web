var PAV = window.PAV || {};
var AuthorizeController = require('./autherize_controller.js');
var validateEmail = require('../utils/email_validation.js');

function LoginCtrl($scope, $location, userService, authService, $rootScope, $routeParams, passwordService, $timeout, $window, Analytics) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
  $scope = $scope || {};
  this.loaded = true;
  this.rs = $rootScope;
  this.userService = userService;
  this.passwordService = passwordService;
  this.analytics = Analytics;
  $scope.login = this;
  this.location = $location;
  this.forgot = false;
  this.passwordSent = false;
  this.rs.inApp = false;
  this.timeout = $timeout;
  this.user = {
    email: '',
    emailValid: true,
    password: '',
    passwordValid: true,
  };


  if (this.location.$$path === '/signup') {
    this.signup = true;
  }


  if (this.location.$$search.forgot) {
    this.forgot = true;
  }

  var that = this;
  that.showNotRegisteredPartial = false;
  var doc = $window.document || document;
  doc.body.addEventListener('not-valid', function() {
    that.showNotRegisteredPartial = true;
  });


  $scope.$on('$routeChangeSuccess', function() {
    if (this.location.hash == '#/signup') {
      $scope.login.signup = true;
    }
  });
}

LoginCtrl.prototype.goTo = function(path) {
  this.location.path(path);
};

LoginCtrl.prototype.loginWithFacebook = function() {
  var that = this;
  this.loaded = false;
  this.userService.loginWithFacebook(function(err, response) {
    if (err) {
      if (err.status === 999) {
        that.loaded = true;
        return that.location.path('/');
      }
      if (that.rs.notLoggedIn) {
        that.showNotRegisteredPartial = false;
      }
      that.rs.facebookSignUp = true;
      that.analytics.trackEvent('Signup', 'Onboarding: Facebook');
      return that.location.path('/onboarding');
    }

    that.userService.getUserProfile('me', function(err, result) {
      if (err) {
        return;
      }
      if (result) {
        that.showNotRegisteredPartial = false;
        that.rs.user = result;
        that.rs.inApp = true;
        that.rs.notLoggedIn = false;
        that.loaded = true;
        that.analytics.trackEvent('Login', 'Facebook');
        that.location.path('/feed');
      }
    });
  });
};

LoginCtrl.prototype.validate = function(u, hash) {
  var that = this;
  var email = u.email;
  var password = u.password;
  this.user.emailValid = this.emailValidation(email);
  this.user.passwordValid = this.passwordValidation(password);
  if (!this.user.emailValid || !this.user.passwordValid) {
    return;
  }
  this.userService.checkEmail(email, function(succeeded) {
    if (succeeded) {
      that.userService.createUser(email, password);
      that.showNotRegisteredPartial = false;
      that.location.path(hash);
    } else {
      that.emailUsed = true;
    }
  });
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
  this.loaded = false;
  this.userService.login(validUser, function(err, response) {
    if (err) {
      that.loaded = true;
      that.loginInvalid = true;
      that.analytics.trackEvent('Login Failed', 'Email: ' + validUser.email);
      return;
    }
    that.userService.getUserProfile('me', function(err, result) {
      that.loaded = true;
      if (err) {
        return that.logout();
      }
      that.showNotRegisteredPartial = false;
      that.rs.user = result;
      that.rs.inApp = true;
      that.rs.notLoggedIn = false;
      that.analytics.trackEvent('Login', 'Email');
      that.location.path('/feed');
    });
  });
};

LoginCtrl.prototype.logout = function() {
  this.rs.inApp = false;
  this.rs.notLoggedIn = true;
  this.rs.user = {};
  AuthorizeController.logout({authorizer: this.authService, location: this.location});
};

LoginCtrl.prototype.emailValidation = function(email) {
  return validateEmail(email);
};

LoginCtrl.prototype.passwordValidation = function(password) {
  var passwordTrimmed = password.trim();
  if (password.length > 5 && passwordTrimmed === password) {
    return true;
  }
  return false;
};

LoginCtrl.prototype.passwordReset = function(email) {
  var that = this;
  this.loaded = false;
  this.passwordService.passwordReset(email, function(err,res) {
    if (err) {
      that.loaded = true;
      that.resetFailed = true;
      that.resetSuccess = false;
      that.analytics.trackEvent('Password Reset', 'Fail: ' + email);
    }
    if (res) {
      that.analytics.trackEvent('Password Reset', 'Success: ' + email);
      that.loaded = true;
      that.resetFailed = false;
      that.resetSuccess = true;
      that.timeout(function() {that.location.search('');}, 1000);
    }
  });
};

module.exports = LoginCtrl;
PAV.loginController = LoginCtrl;
