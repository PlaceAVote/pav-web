function FollowedByUserEvent(options){
  this.type = options.type;
  this.user_id = options.user_id;
  this.follower_id = options.follower_id;
  this.timestamp = options.timestamp;
  this.last_name = options.last_name;
  this.first_name = options.first_name;
}

module.exports = FollowedByUserEvent;
