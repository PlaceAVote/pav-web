function User(email, password) {
	this.email = email;
	this.password = password;
	this.topics;
	this.first_name;
	this.last_name;
	this.dob;
	this.country_code;
  this.img_url;
  this.private = false;
}

User.createFromJson = function(json){
  json = json || {};
  var user = new User();
  user.email = json.email;
  user.password = json.password;
  user.topics = json.topics;
  user.first_name = json.first_name;
  user.last_name = json.last_name;
  user.dob = json.dob;
  user.country_code = json.country_code;
  user.img_url = json.img_url || 'img/comments/user.png';
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


User.prototype.getTopicNames = function() {
    var names = [];
    if(this.topics){
        var topicLength = this.topics.length;
        for(var i = topicLength-1; i>=0; i--) {
            names.push(this.topics[i].name);
        };
    }
    return names;
};


User.prototype.toBody = function(auth) {
    var body = {
        first_name: this.first_name,
        last_name: this.last_name,
        country_code: this.country_code,
        dob: this.dob,
        topics: this.getTopicNames(),
        email: this.email
    };
    if(auth) {
        body.token = auth;
    }
    else {
        body.password = this.password;
    }
    if(this.img_url){
        body.img_url = this.img_url;
    }
    return body;
};

module.exports = User;
