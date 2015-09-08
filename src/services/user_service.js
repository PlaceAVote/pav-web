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
	this.user.firstname = additionalInformation.firstname;
	this.user.surname = additionalInformation.surname;
	this.user.country = additionalInformation.country;
	this.user.dob = additionalInformation.dob;
};

module.exports = UserService;
