var AuthorizeController = require('./autherize_controller.js');

function HeaderCtrl($rootScope, $scope, $location, authService, userService, notificationService) {
  $scope = $scope || {};
  $scope.header = this;
  this.userService = userService;
  this.authService = authService;
  this.notificationService = notificationService;
  this.location = $location;
  this.showDropDown = false;
  this.rs = $rootScope;
  this.loggedIn = $rootScope.loggedIn;
  this.populate();
  this.startNotifications();
  this.getNotifications();
}

HeaderCtrl.prototype.getNotifications = function() {
  var that = this;
  this.notificationService.getNotifications(function(err, res) {
    if(err) {
      return;
    } else {
      that.notifications = res;
      console.log(that.notifications);
    }
  });
}

HeaderCtrl.prototype.startNotifications = function() {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  this.notificationService.stream(function(err, result){
    if (result) {
      that.notifications.push(result[0]);
      console.log('controller result', that.notifications);
      that.notifyUser();
    }
  });
};

HeaderCtrl.prototype.notifyUser = function() {
  this.notificationReceived = true;
  console.log('received notification');
};

HeaderCtrl.prototype.populate = function() {
  var that = this;
  this.userService.getUserProfile('me', function(err, result) {
    if (result) {
      that.rs.user = result;
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

HeaderCtrl.prototype.hideNotifications = function() {
  this.notificationReceived = false;
  this.showNotifications = false
};

HeaderCtrl.prototype.notify = function() {
  this.showNotifications = this.showNotifications ? false : true;
};

HeaderCtrl.prototype.logout = function() {
  this.loggedIn = false;
  AuthorizeController.logout({authorizer: this.authService, location: this.location});
};

HeaderCtrl.prototype.toProfile = function() {
    this.location.path('/profile/me');
};

module.exports = HeaderCtrl;
