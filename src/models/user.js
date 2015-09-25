function User(email, password) {
	this.email = email;
	this.password = password;
	this.topics;
	this.first_name;
	this.last_name;
	this.dob;
	this.country_code;
    this.img_url;
}

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
