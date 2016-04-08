var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');

function HeaderCtrl($rootScope, $scope, $location, $timeout, authService, userService, notificationService, searchService, $window, $route) {
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

  if (this.rs.notLoggedIn === undefined) {
    this.rs.notLoggedIn = true;
  }

  this.populate();
  this.unread = 0;
  this.notifications = [];
  this.userNotifications = [];
  this.newNotification = {};
  this.window = $window;
  this.searchResults = [];
  this.timeout = $timeout;
  this.focus = false;
  this.searching = false;
  this.route = $route;


  $scope.$watchCollection(function() {
    return $rootScope.user;
  },
  function(newValue, oldValue) {
    var that = this;
    if (newValue && !oldValue) {
      if (newValue.first_name) {
        $rootScope.notLoggedIn = false;
        $scope.header.intercomInit(newValue);
        $scope.header.getNotifications();
        $scope.header.startNotifications();
      } else if (!newValue.first_name) {
        $scope.header.intercomShutdown(newValue);
      }
    }
  }, true);


  $scope.$watch(function() {
    return $rootScope.notLoggedIn;
  }, function(newValue, oldValue) {
    if (newValue === false && oldValue === undefined) {
      $scope.header.populate();
    }
  }, true);

}

HeaderCtrl.prototype.intercomInit = function(user) {
  window.Intercom('boot', {
    app_id: 'sh17vmbl',
    name: user.first_name + ' ' + user.last_name,
    email: user.email,
  });

};


HeaderCtrl.prototype.intercomShutdown = function(user) {
  window.Intercom('shutdown');
};


HeaderCtrl.prototype.getNotifications = function() {
  var that = this;
  this.notificationService.getNotifications(undefined, function(err, res) {
    if (err) {
      return;
    }
    that.notifications = res.results;
    that.newTimestamp = res.last_timestamp;
    for (var i = 0; i < that.notifications.length; i++) {
      if (that.notifications[i].hasOwnProperty('read')) {
        if (!that.notifications[i].read) {
          that.unread++;
        }
      }
    }
    title.notifications(that.unread);
  });
};


HeaderCtrl.prototype.notificationCheck = function() {
  var that = this;
  if (!this.showNotifications) {
    return;
  }
  if (this.loadingScroll || this.newTimestamp === this.lastLoaded) {
    return;
  }
  this.loadingScroll = true;
  this.notificationService.getNotifications(this.newTimestamp, function(err, response) {
    that.loadingScroll = false;
    if (!err) {
      if (response.last_timestamp === null) {

        for (var i in response.results) {
          that.notifications.push(response.results[i]);
        }
        that.newTimestamp = null;
        that.lastLoaded = null;
      } else {
        that.lastLoaded = that.newTimestamp;
        that.newTimestamp = response.last_timestamp;
        for (var x in response.results) {
          that.notifications.push(response.results[x]);
        }
      }
    }
  });
};


HeaderCtrl.prototype.startNotifications = function() {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  this.notificationService.stream(function(err, result) {
    if (!err) {
      that.rs.$apply(function() {
        that.notificationReceived = true;
        that.unread++;
        title.notifications(that.unread);
        that.notifications.unshift(result);
      });
    }
  });
};


HeaderCtrl.prototype.signup = function() {
  var event = new CustomEvent('not-valid', { detail: 'Sign Up Button', controller: 'Header' });
  document.body.dispatchEvent(event);
};


HeaderCtrl.prototype.readEvent = function(res) {
  if (!this.notificationService) {
    return;
  }
  var that = this;
  if (!res.read) {
    this.notificationService.readNotification(res.notification_id, function(err, result) {
      if (!err) {
        res.read = true;
        that.unread--;
        if (that.unread < 0) {
          that.unread = 0;
        }
        title.notifications(that.unread);
      } else if (err) {
        console.log(err);
      }
    });
  }
};


HeaderCtrl.prototype.populate = function() {
  var that = this;

  this.userService.getUserProfile('me', function(err, result) {
    if (result) {
      that.rs.user = result;
      that.rs.inApp = true;
    }
  });
};


HeaderCtrl.prototype.inPlatform = function() {
  return this.rs.inApp;
};


HeaderCtrl.prototype.notLoggedIn = function() {
  return this.rs.notLoggedIn;
};


HeaderCtrl.prototype.hideDropDown = function() {
  this.showDropDown = false;
};


HeaderCtrl.prototype.dropDown = function() {
  this.hideNotifications();
  this.showDropDown = this.showDropDown ? false : true;
};


HeaderCtrl.prototype.hideNotifications = function() {
  this.notificationReceived = false;
  this.showNotifications = false;
};


HeaderCtrl.prototype.notify = function() {

  var that = this;

  if (this.notifications.length < 1 && this.unread < 1) {
    return;
  }

  that.hideDropDown();

  that.showNotifications = that.showNotifications ? false : true;

  if (that.showNotifications) {
    that.unread = 0;
    title.notifications(that.unread);
  }

};


HeaderCtrl.prototype.logout = function() {
  that = this;
  this.rs.inApp = false;
  this.rs.user = {};
  this.rs.notLoggedIn = true;
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


HeaderCtrl.prototype.toSettings = function() {
  this.hideDropDown();
  this.location.path('/settings');
};


HeaderCtrl.prototype.search = function(q) {
  var that = this;
  if (this.cachedSearch === q) {
    this.searchResults = this.cachedResults;
    return;
  }
  this.cachedSearch = q;
  this.searching = true;
  this.timeout(function() {
    that.searchService.search(q, function(err, response) {
      if (response) {
        that.searchResults = response;
        that.cachedResults = response;
        that.searching = false;
      }
    });
  }, 500);
};


HeaderCtrl.prototype.goTo = function(path) {
  this.location.path(path);
};


HeaderCtrl.prototype.feedRefresh = function() {
  this.location.path('/feed');
  this.route.reload();
};


module.exports = HeaderCtrl;

