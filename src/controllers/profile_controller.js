var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');

function ProfileController($scope, $location, $routeParams, authService, userService, $window) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  $scope = $scope || {};
  $scope.profile = this;
  this.location = $location;
  this.authService = authService;
  this.userService = userService;
  this.id = $routeParams.id;
  this.populate();
}

ProfileController.prototype.loadProfile = function(id){
  if (!id) {
    return;
  }
  this.location.path('/profile/' + id);
};

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
      title.profile(that.user);
      result.following ? that.following = "unfollow" : that.following = "follow";
      that.followStatus = result.following;
    }
  });
};


ProfileController.prototype.populateTimeline = function() {
  var that = this;
  this.userService.getUserTimeline(this.id, function(err, result) {
    if (!err) {
      that.timeline = result;
      !result.timeline.length ? that.hasActivity = false : that.hasActivity = true;
    }
  });
};

ProfileController.prototype.populateFollowers = function() {
  var that = this;
  this.userService.getFollowers(this.id, function(err, result) {
    if (!err) {
      that.followers = result;
      !result.length ? that.hasFollowers = false : that.hasFollowers = true;
    }
  });
};

ProfileController.prototype.populateFollowing = function() {
  var that = this;
  this.userService.getFollowing(this.id, function(err, result) {
    if (!err) {

    }
  });
};

ProfileController.prototype.isNotMe = function() {
  if (this.id == 'me') {
    return false;
  }
  else {
    return true;
  }
};

ProfileController.prototype.follow = function() {
  var that = this;
  if (!this.isNotMe()) {
    return;
  }
  if(!this.followStatus) {
    this.userService.follow(this.id, function(err, response) {
      if (!err) {
        that.user.following = false;
        that.populate();
      }
    });
  } else if(this.followStatus){
    this.userService.unfollow(this.id, function(err, response) {
      if (!err) {
        that.user.following = true;
        that.populate();
      }
    });
  }
};


module.exports = ProfileController;

