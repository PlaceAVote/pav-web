var PAV = window.PAV || {};
var title = require('../config/titles.js');

function ProfileController($scope, $location, $routeParams, authService, userService, issueService, $rootScope) {
  $scope = $scope || {};
  $scope.profile = this;
  this.location = $location;
  this.authService = authService;
  this.userService = userService;
  this.rs = $rootScope;
  this.rs.inApp = true;
  if ($routeParams.issueid) {
    this.issueService = issueService;
    this.getIssue($routeParams.issueid);
    this.loadingIssue = true;
    this.showIssue = true;
    this.authenticate();
  } else {
    this.id = $routeParams.id;
    this.showFollowers = true;
    this.populate();
  }

  this.profilePicture = {
    saving: true,
  };
}

ProfileController.prototype.authenticate = function() {
  var that = this;
  if (!that.authService) {
    return;
  }
  that.authService.validateToken(function(result) {
    that.validated = result;
    that.rs.notLoggedIn = !result;
  });
};


ProfileController.prototype.loadProfile = function(id) {
  if (!id) {
    return;
  }


  if (this.rs.notLoggedIn && id === 'me') {
    this.location.path('/');
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
  if (this.rs.notLoggedIn && this.id === 'me') {
    this.location.path('/');
    return;
  }

  this.userService.getUserProfile(this.id, function(err, result) {
    if (!err) {
      that.user = result;
      title.profile(that.user);
      that.following = result.following ? 'Unfollow' : 'Follow';
      that.followStatus = result.following;
      if (!that.issue) {
        that.metaImage = 'http://s29.postimg.org/v86d7ur2v/og_fb_img.jpg';
        that.metaTitle = result.first_name + ' ' + result.last_name;
        that.metaDescription = 'Follow ' + result.first_name + ' ' + result.last_name + ' on Placeavote.';
      }
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


ProfileController.prototype.populateFollowers = function() {
  var that = this;
  this.userService.getFollowers(this.id, function(err, result) {
    if (!err) {
      that.currentFollowers = result;
      that.hasFollowers = !result.length ? false : true;
    }
  });
};

ProfileController.prototype.populateFollowing = function() {
  var that = this;
  this.userService.getFollowing(this.id, function(err, result) {
    if (!err) {
      that.currentFollowing = result;
      that.isFollowing = !result.length ? false : true;
    }
  });
};

ProfileController.prototype.isMe = function() {
  if (this.rs.notLoggedIn) {
    return false;
  }
  var me = this.userService.isUserMe(this.id);
  return me;
};

ProfileController.prototype.follow = function() {
  var that = this;
  if (this.isMe()) {
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

ProfileController.prototype.getIssue = function(issue) {
  var that = this;
  this.issueService.getIssue(issue, function(err, res) {
    that.loadingIssue = false;
    if (err) {
      that.issueError = true;
    }
    if (res) {
      that.id = res.user_id;
      that.populateProfile();
      that.issue = res;
      that.metaImage = res.article_img || 'http://s29.postimg.org/v86d7ur2v/og_fb_img.jpg';
      that.metaTitle = res.comment;
      that.metaDescription = 'Do you agree or disagree?';
    }
  });
};

ProfileController.prototype.closeIssue = function() {
  this.showIssue = false;
  this.location.path('profile/' + this.id);
};

ProfileController.prototype.hasCropped = function() {
  this.profilePicture.cropped = true;
};

ProfileController.prototype.saveProfilePicture = function(img) {
  var that = this;
  this.profilePicture.saving = false;
  this.userService.profilePicture(img.img, function(err, res) {
    if (err) {
      that.profilePicture.error = true;
      that.profilePicture.saving = true;
    }

    if (res) {
      that.profilePicture.saving = true;
      that.profilePicture.success = true;
      that.rs.user.img_url = res.img_url;
      that.user.img_url = res.img_url;
      that.showModal = false;
    }
  });
};
module.exports = ProfileController;
PAV.profileController = ProfileController;
