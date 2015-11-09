var Banner = require('../models/banner.js');

FeedController = function($scope, $location, userService, billService, trendService, authService) {
    this.$scope = $scope || {};
    $scope.$location = $location || {};
    this.trendService = trendService;
    this.billService = billService;
    var token = authService.getAccessToken();
    if(!token){
        $location.path('/');
    }
    var user = {};
    $scope.user = user;
    $scope.banner = new Banner(user);
    this.getBills(user.email, function(err, response){
        if(!err){
            $scope.bills = response;
        }
    });
    this.getTrends(function(err, response){
      if(!err){
        $scope.trends = response;
      }
    });
}

FeedController.prototype.getTrends = function(callback){
  this.trendService.getTrends(callback);
};

FeedController.prototype.getBills = function(username, callback){
  this.billService.getBills(username, callback);
};

module.exports = FeedController;
