var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');

FeedController = function($scope, $location, userService, billService, authService, feedService, $rootScope, $timeout) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.billService = billService;
  this.userService = userService;
  this.feedService = feedService;
  this.timeout = $timeout;
  this.rs = $rootScope;
  this.rs.inApp = true;
  this.getTrends();
  this.getUserProfile(function(err, response) {
    var that = this;
    if (err) {
      if (err.status === 401) {
        $location.path('/');
      }
    } else {
      $rootScope.notLoggedIn = false;
      $scope.user = response;
      $scope.banner = new Banner(response);
    }
  });

  this.getFeed();
};

FeedController.prototype.getUserProfile = function(callback) {
  this.userService.getUserProfile('me', callback);

};


FeedController.prototype.getTrends = function() {
  var that = this;
  this.trendsLoading = true;
  this.billService.getTrends(function(err, res) {
    that.trendsLoading = false;
    that.trends = false;
    if (!err) {
      that.trends = res;
    }
  });
};

FeedController.prototype.getFeed = function() {
  var that = this;
  this.loading = true;
  this.feedService.getFeed(undefined, function(err, response) {
    that.loading = false;
    if (!err) {
      console.log(response);
      title.feed();
      that.events = response.feed;
      that.lastLoaded = response.last_timestamp;
    }
  });
};

FeedController.prototype.feedCheck = function() {
  var that = this;
  if (this.loadingScroll || this.newTimestamp === this.lastLoaded) {
    return;
  }
  this.newTimestamp = this.lastLoaded;
  this.loadingScroll = true;
  this.feedService.getFeed(this.newTimestamp, function(err, response) {
    that.loadingScroll = false;
    if (!err) {
      title.feed();
      if (response.last_timestamp === null) {
        for (var i in response.feed) {
          that.events.push(response.feed[i]);
        }
        that.feedMessage('.');
      } else {
        that.lastLoaded = response.last_timestamp;
        for (var x in response.feed) {
          that.events.push(response.feed[x]);
        }
      }
    }
  });
};

FeedController.prototype.feedMessage = function(message) {
  this.scrollMessage = message;
};

module.exports = FeedController;
