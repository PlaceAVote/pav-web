var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');

FeedController = function($scope, $location, userService, billService, authService, $rootScope) {
    AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
    this.$scope = $scope || {};
    $scope.$location = $location || {};
    this.billService = billService;
    this.userService = userService;
    this.rs = $rootScope;
    // this.welcomeMessage();
    this.getTrends();

    this.getBills('notyet@implemented.com', function(err, response) {
        if(!err){
            $scope.bills = response;
            title.feed();
        }
    });
    this.getTrends();
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

// FeedController.prototype.welcomeMessage = function() {
//   var that = this;
//    this.userService.getUserProfile('me', function(err, res) {
//     if(!err && that.rs.user.newUser) {
//       that.newUser = true;
//       return that.newUser;
//     } else {
//       that.newUser = false;
//       return that.newUser;
//     }
//    });

// }

FeedController.prototype.getUserProfile = function(callback) {
  this.userService.getUserProfile('me', callback);

};

FeedController.prototype.getTrends = function() {
  var that = this;
  this.billService.getTrends(function(err, res) {
    if(!err) {
    that.trends = res;
    }
  });
};

FeedController.prototype.getBills = function(username, callback) {
  this.billService.getBills(username, callback);
};


module.exports = FeedController;
