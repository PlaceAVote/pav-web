var AuthorizeController = require('./autherize_controller.js');

function HeaderCtrl($rootScope, $scope, $location, authService, userService, notificationService) {
  $scope = $scope || {};
  $scope.header = this;
  this.scope = $scope;
  this.userService = userService;
  this.authService = authService;
  this.notificationService = notificationService;
  this.location = $location;
  this.showDropDown = false;
  this.rs = $rootScope;
  this.loggedIn = $rootScope.loggedIn;
  this.populate();
  this.newEvent = 0;
  this.notifications;
  this.getNotifications();
  this.startNotifications();
}

HeaderCtrl.prototype.notificationsCounter = function(inc) {
  inc ? this.newEvent++ : this.newEvent--;
}

HeaderCtrl.prototype.getNotifications = function() {
  var that = this;
  this.notificationService.getNotifications(function(err, res) {
    if(err) {
      return;
    } else {
      that.notifications = res;
      for(var i = 0; i < that.notifications.length; i++) {
        if(!that.notifications[i].read) {
          that.notificationsCounter(true);
        }
      }
    }
  });
}

HeaderCtrl.prototype.startNotifications = function() {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  this.notificationService.stream(function(err, result){
    if (!err) {
      that.notifyUser(result);
    }
  });
};

HeaderCtrl.prototype.readEvent = function(res) {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  this.location.path('bill/' + res.comment.bill_id);
  if(!res.read) {
  this.notificationService.readNotification(res.notification_id, function(err, result) {
    if (!err) {
      res.read = true;
      that.notificationsCounter(false);
    }
  });
  }
}

HeaderCtrl.prototype.notifyUser = function(result) {
  this.notificationReceived = true;
  this.notifications.unshift(result[0]);
  this.notificationsCounter(true);
  this.scope.$apply();
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
