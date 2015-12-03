var AuthorizeController = require('./autherize_controller.js');

function HeaderCtrl($rootScope, $scope, $location, authService, userService) {
  $scope = $scope || {};
  $scope.header = this;
  this.userService = userService;
  this.authService = authService;
  this.location = $location;
  this.showDropDown = false;
  this.rs = $rootScope;
  this.loggedIn = $rootScope.loggedIn;
  this.populate();
}

HeaderCtrl.prototype.populate = function() {
  var that = this;
  this.userService.getUserProfile('me', function(err, result) {
    if (!err) {
      that.user = result;
      that.rs.loggedIn = true;
    } else {
      that.logout();
    }
  });
};

HeaderCtrl.prototype.login = function() {
    return this.rs.loggedIn;
};

HeaderCtrl.prototype.hideDropDown = function() {
  this.showDropDown = false
};

HeaderCtrl.prototype.dropDown = function() {
  this.showDropDown = this.showDropDown ? false : true;
};

HeaderCtrl.prototype.logout = function() {
  this.loggedIn = false;
  AuthorizeController.logout({authorizer: this.authService, location: this.location});
};

HeaderCtrl.prototype.toProfile = function() {
    this.location.path('/profile/me');
};

module.exports = HeaderCtrl;
