var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');

FeedController = function($scope, $location, userService, billService, authService, feedService, $rootScope) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.billService = billService;
  this.userService = userService;
  this.feedService = feedService;
  this.rs = $rootScope;
  this.getTrends();
  this.getUserProfile(function(err, response) {
    if (err) {
      if (err.status === 401) {
        $location.path('/');
      }
    } else {
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
  this.billService.getTrends(function(err, res) {
    if (!err) {
      that.trends = res;
    }
  });
};

FeedController.prototype.getFeed = function() {
  var that = this;
  this.loading = true;
  this.feedService.getFeed(function(err, response) {
    that.loading = false;
    if (!err) {
      title.feed();
      that.events = response.feed;
    }
  });
};

module.exports = FeedController;
