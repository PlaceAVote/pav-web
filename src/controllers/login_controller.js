var AuthorizeController = require('./autherize_controller.js');

function LoginCtrl($scope, $location, userService, authService, $rootScope, $routeParams, passwordService, $timeout, doc) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
  $scope = $scope || {};
  this.loaded = true;
  this.rs = $rootScope;
  this.userService = userService;
  this.passwordService = passwordService;
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
  doc = doc || document;
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
        that.location.path('/feed');
      }
    });
  });
};

LoginCtrl.prototype.validate = function(u, hash) {
  var email = u.email;
  var password = u.password;
  this.user.emailValid = this.emailValidation(email);
  this.user.passwordValid = this.passwordValidation(password);
  if (this.user.emailValid && this.user.passwordValid) {
    this.userService.createUser(email, password);
    this.showNotRegisteredPartial = false;
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
  this.loaded = false;
  this.userService.login(validUser, function(err, response) {
    if (err) {
      that.loaded = true;
      that.loginInvalid = true;
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
  var e = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return e.test(email);
};

LoginCtrl.prototype.passwordValidation = function(password) {
  var passwordTrimmed = password.trim();
  if (password.length > 5 && passwordTrimmed === password) {
    return true;
  }
};

LoginCtrl.prototype.passwordReset = function(email) {
  var that = this;
  this.loaded = false;
  this.passwordService.passwordReset(email, function(err,res) {
    if (err) {
      that.loaded = true;
      that.resetFailed = true;
      that.resetSuccess = false;
    }
    if (res) {
      that.loaded = true;
      that.resetFailed = false;
      that.resetSuccess = true;
      that.timeout(function() {that.location.search('');}, 1000);
    }
  });
};

module.exports = LoginCtrl;
