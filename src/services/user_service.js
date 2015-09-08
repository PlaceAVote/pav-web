var User = require('../models/user.js');

function UserService() {
}

UserService.prototype.createUser = function(username, password) {
	this.user = new User(username, password);	
};

UserService.prototype.getUser = function(){
	return this.user;
};

UserService.prototype.addInterests = function(interests){
	if(!this.user) {
		return;
	}
	this.user.interests = interests;
};

UserService.prototype.addAdditionalInformation = function(additionalInformation) {
	if(!this.user){
		return;
	}
	this.user.first_name = additionalInformation.first_name;
	this.user.last_name = additionalInformation.last_name;
	this.user.country_code = additionalInformation.country_code;
	this.user.dob = additionalInformation.dob;
};

module.exports = UserService;
