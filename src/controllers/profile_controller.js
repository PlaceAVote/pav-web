var AuthorizeController = require('./autherize_controller.js');

function ProfileController($scope, $location, $routeParams, authService, userService) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  $scope = $scope || {};
  $scope.profile = this;
  this.location = $location;
  this.authService = authService;
  this.userService = userService;
  this.id = $routeParams.id;
  this.populate();
}

ProfileController.prototype.populate = function() {
  this.populateProfile();
  this.populateTimeline();
  this.populateFollowers();
  this.populateFollowing();
};

ProfileController.prototype.populateProfile = function() {
  var that = this;
  this.userService.getUserProfile(this.id, function(err, result) {
    if (!err) {
      that.user = result;
    }
  });
};

ProfileController.prototype.populateTimeline = function() {
  var that = this;
  this.userService.getUserTimeline(this.id, function(err, result) {
    if (!err) {
      that.timeline = result;
    }
  });
};

ProfileController.prototype.populateFollowers = function() {
  var that = this;
  this.userService.getFollowers(this.id, function(err, result) {
    if (!err) {
      that.followers = result;
    }
  });
};

ProfileController.prototype.populateFollowing = function() {
  var that = this;
  this.userService.getFollowing(this.id, function(err, result) {
    if (!err) {
      that.following = result;
    }
  });
};

module.exports = ProfileController;

