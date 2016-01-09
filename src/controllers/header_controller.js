var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');

function HeaderCtrl($rootScope, $scope, $location, $timeout, authService, userService, notificationService, searchService, $window) {
  $scope = $scope || {};
  $scope.header = this;
  this.scope = $scope;
  this.userService = userService;
  this.authService = authService;
  this.notificationService = notificationService;
  this.searchService = searchService;
  this.location = $location;
  this.showDropDown = false;
  this.rs = $rootScope;
  this.loggedIn = $rootScope.loggedIn;
  this.unread = 0;
  this.populate();
  this.notifications = [];
  this.userNotifications = [];
  this.newNotification = {};
  this.window = $window;
  $scope.searchResults = [];

  $scope.$watchCollection(function() {
    return $rootScope.user;
  }, 
  function(newValue, oldValue) {
    var that = this;
    if(newValue) {
        if(newValue.first_name) {
        $scope.header.intercomInit(newValue); 
        $scope.header.getNotifications();
        $scope.header.startNotifications();
        } else if(!newValue.first_name) {
        $scope.header.intercomShutdown(newValue) 
        }
      }
    }, true);

  $scope.search = function() {
    if ($scope.query.length < 3) {
      $scope.searchResults = [];
      return;
    }

    searchService.search($scope.query, function(err, response) {
      $scope.searchResults = response;
    });
  }

  var filterTimer;
  $scope.delaySearch = function() {
    $timeout.cancel(filterTimer);  

    filterTimer = $timeout(function() {
      if ($scope.query.length < 3) {
        $scope.searchResults = [];
      } else {
        searchService.search($scope.query, function(err, response) {
          $scope.searchResults = response;
          $scope.isOpened = $scope.searchResults.length > 0 && $scope.query != '';
        });
      }
    }, 250); // delay 250 ms
  };

}

HeaderCtrl.prototype.intercomInit = function(user) {
window.Intercom('boot', {
  app_id: "sh17vmbl",
  name: user.first_name + ' ' + user.last_name,
  email: user.email
});

}

HeaderCtrl.prototype.intercomShutdown = function(user) {
window.Intercom('shutdown');
}

HeaderCtrl.prototype.getNotifications = function() {
  var that = this;
  this.notificationService.getNotifications(function(err, res) {
    if(err) {
      return;
    } else {
      that.notifications = res;
      for(var i = 0; i < that.notifications.results.length; i++) {
        if(!that.notifications.results[i].read) {
          that.unread++;
        }
      }
      title.notifications(that.unread);
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
        that.rs.$apply(function() {
          that.notificationReceived = true;
          that.unread++;
          title.notifications(that.unread);
          that.newNotification = result;
        });
    }
  });
};

HeaderCtrl.prototype.readEvent = function(res) {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  if(!res.read) {
  this.notificationService.readNotification(res.notification_id, function(err, result) {
    if (!err) {
      res.read = true;
      that.unread--;
      title.notifications(that.unread);
    } else if(err) {
      console.log(err);
    }
  });
  }
}

HeaderCtrl.prototype.populate = function() {
  var that = this;
  this.userService.getUserProfile('me', function(err, result) {
    if(err) {
      return;
    } else if (result) {
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
  this.hideNotifications();
  this.showDropDown = this.showDropDown ? false : true;
};

HeaderCtrl.prototype.hideNotifications = function() {
  this.notificationReceived = false;
  this.showNotifications = false
};

HeaderCtrl.prototype.notify = function() {
  var that = this;
  if (this.notifications.results.length < 1 && this.unread < 1) {
    return;
  } else {
  that.hideDropDown();
  that.showNotifications = that.showNotifications ? false : true;
  }
};

HeaderCtrl.prototype.logout = function() {
  that = this;
  this.rs.loggedIn = false;
  this.rs.user = {};
  this.unread = 0;
  this.notificationService.close(function(res) {
    that.notifications = undefined;
  });
  AuthorizeController.logout({authorizer: this.authService, location: this.location});
};

HeaderCtrl.prototype.toProfile = function() {
    this.hideDropDown();
    this.location.path('/profile/me');
};

module.exports = HeaderCtrl;
