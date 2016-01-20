var AuthorizeController = require('./autherize_controller.js');

function PasswordController($scope, $location, $routeParams, passwordService, authService) {
  AuthorizeController.authorize({success: '/feed', authorizer: authService, location: $location});
  $scope = $scope || {};
  this.location = $location;
  this.routeParams = $routeParams;
  this.passwordService = passwordService;
  this.user = {
    reset_token: this.routeParams.token,
    new_password: '',
  };
  this.newPasswordConfirm = '';
  this.newPassword();
}

PasswordController.prototype.newPassword = function() {
  var that = this;
  if (this.user.new_password.length < 6) {
    that.noPassword = true;
    return;
  }
  if (this.newPasswordConfirm !== this.user.new_password) {
    that.noMatch = true;
    return;
  }
  this.noPassword = false;
  this.noMatch = false;
  this.passwordService.newPassword(this.user, function(err, res) {
    if (err) {
      that.confirmed = false;
      that.failed = true;
    }

    if (res) {
      that.failed = false;
      that.confirmed = true;
    }
  });

};

PasswordController.prototype.goTo = function(url) {
  this.location.path(url);
};

module.exports = PasswordController;
