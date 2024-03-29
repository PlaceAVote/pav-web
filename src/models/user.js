function User(email, password) {
  this.email = email;
  this.password = password;
  this.topics = undefined;
  this.first_name = undefined;
  this.last_name = undefined;
  this.dob = undefined;
  this.img_url = undefined;
  this.private = false;
  this.gender = undefined;
}

User.createFromJson = function(json) {
  json = json || {};
  var user = new User();
  user.last_activity = json.last_activity;
  user.lat = json.lat;
  user.lng = json.lng;
  user.total_votes = json.total_votes;
  user.created_at = json.created_at;
  user.district = json.district;
  user.state = json.state;
  user.zipcode = json.zipcode;
  user.email = json.email;
  user.password = json.password;
  user.topics = json.topics;
  user.first_name = json.first_name;
  user.last_name = json.last_name;
  user.dob = json.dob;
  user.country_code = json.country_code;
  user.img_url = json.img_url || '//cdn.placeavote.com/img/profile/profile-picture.png';
  user.following = json.following;
  user.total_followers = json.total_followers;
  user.total_following = json.total_following;
  user.user_id = json.user_id;
  this.private = json.private;
  user.loadedFromServer = true;
  return user;
};

User.prototype.setToken = function(token) {
  this.token = token;
  this.password = undefined;
};

User.prototype.setFacebookToken = function(token) {
  this.facebookToken = token;
  this.password = undefined;
};

User.prototype.setFaceBookId = function(id) {
  this.facebookId = id;
};


User.prototype.getTopicNames = function() {
  var names = [];
  if (this.topics) {
    var topicLength = this.topics.length;
    for (var i = topicLength - 1; i >= 0; i--) {
      names.push(this.topics[i].name);
    }
  }
  return names;
};


User.prototype.toBody = function() {
  var body = {
    first_name: this.first_name,
    last_name: this.last_name,
    zipcode: this.zipcode,
    dob: this.dob,
    topics: this.getTopicNames(),
    email: this.email.toLowerCase(),
    gender: this.gender,
  };

  if (this.facebookId && this.facebookToken) {
    body.token = this.facebookToken;
    body.id = this.facebookId;
  } else {
    body.password = this.password;
  }

  if (this.img_url) {
    body.img_url = this.img_url;
  }
  return body;
};

module.exports = User;
