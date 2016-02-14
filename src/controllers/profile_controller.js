var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');

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

ProfileController.prototype.loadProfile = function(id) {
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
      that.following = result.following ? 'unfollow' : 'follow';
      that.followStatus = result.following;
    }
  });
};

ProfileController.prototype.populateTimeline = function() {
  var that = this;
  this.userService.getUserTimeline(undefined, this.id, function(err, result) {
    if (!err) {
      that.timeline = result;
      that.newTimestamp = that.timeline.last_timestamp;
      that.hasActivity = !result.timeline.length ? false : true;
    }
  });
};

ProfileController.prototype.getTimeLineEvents = function() {
  var that = this;
  if (this.loadingScroll || this.newTimestamp === this.lastLoaded) {
    return;
  }
  this.loadingScroll = true;
  this.userService.getUserTimeline(this.newTimestamp, this.id, function(err, result) {
    that.loadingScroll = false;
    if (result) {
      if (result.last_timestamp === null) {
        for (var i in result.timeline) {
          that.timeline.timeline.push(result.timeline[i]);
        }
        that.setTimeLineEventMessage('End of the line.');
        that.newTimestamp = null;
        that.lastLoaded = null;
      } else {
        that.lastLoaded = that.newTimestamp;
        that.newTimestamp = result.last_timestamp;
        for (var x = 0; x < result.timeline.length ; x++) {
          that.timeline.timeline.push(result.timeline[x]);
        }
        that.hasActivity = !result.timeline.length ? false : true;
      }
    }
  });
};

ProfileController.prototype.setTimeLineEventMessage = function(message) {
  var that = this;
  this.timeLineEventMessage = message;
};

// Profile.prototype.toggleFollowers = function() {
//   this.showFollowers ? this.showFollowers = false;
// };

ProfileController.prototype.populateFollowers = function() {
  var that = this;
  this.userService.getFollowers(this.id, function(err, result) {
    if (!err) {
      that.followers = result;
      that.hasFollowers = !result.length ? false : true;
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
  if (this.id === 'me') {
    return false;
  }
  return true;
};

ProfileController.prototype.follow = function() {
  var that = this;
  if (!this.isNotMe()) {
    return;
  }
  if (!this.followStatus) {
    this.userService.follow(this.id, function(err, response) {
      if (!err) {
        that.user.following = false;
        that.populate();
      }
    });
  } else if (this.followStatus) {
    this.userService.unfollow(this.id, function(err, response) {
      if (!err) {
        that.user.following = true;
        that.populate();
      }
    });
  }
};


module.exports = ProfileController;

