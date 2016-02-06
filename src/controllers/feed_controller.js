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

  this.getFeed(function(err, response) {
    var that = this;
    if (!err) {
      title.feed();

      // var bills = [];
      // var issues = [];
      // for (var r in response.feed) {
      //   if (response.feed[r] instanceof BillSummary) {
      //     bills.push(response.feed[r]);
      //   } else if (response.feed[r] instanceof Issue) {
      //     issues.push(response.feed[r]);
      //   }
      // }
      // $scope.bills = bills;
      // $scope.issues = issues;
      $scope.events = response.feed;
      console.log($scope.events);
    }
  });
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

FeedController.prototype.getFeed = function(callback) {
  this.feedService.getFeed(callback);
};

module.exports = FeedController;
