var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');

FeedController = function($scope, $location, userService, billService, trendService, authService) {
    AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
    this.$scope = $scope || {};
    $scope.$location = $location || {};
    this.trendService = trendService;
    this.billService = billService;
    this.userService = userService;
    this.getBills('notyet@implemented.com', function(err, response) {
        if(!err){
            $scope.bills = response;
        }
    });
    this.getTrends(function(err, response) {
      if(!err){
        $scope.trends = response;
      }
    });

    this.getUserProfile(function(err, response) {
      if(err) {
        if(err.status === 401) {
          $location.path('/');
        }
      }
      else {
        $scope.user = response;
        $scope.banner = new Banner(response);
      }
    });
}

FeedController.prototype.getUserProfile = function(callback) {
  this.userService.getUserProfile(callback);
};

FeedController.prototype.getTrends = function(callback) {
  this.trendService.getTrends(callback);
};

FeedController.prototype.getBills = function(username, callback) {
  this.billService.getBills(username, callback);
};

module.exports = FeedController;
