function FollowingUserEvent(options) {
  var options = options || {}
  this.type = options.type;
  this.user_id = options.user_id;
  this.following_id = options.following_id;
  this.timestamp = options.timestamp;
  this.last_name = options.last_name;
  this.first_name = options.first_name;
}

FollowingUserEvent.prototype.loadProfile = function(id, location) {
  if (!id || !location || !location.path) {
    return;
  }
  location.path('/profile/' + id);
};

module.exports = FollowingUserEvent;

