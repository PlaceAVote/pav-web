var User = require('../models/user.js');

function UserService() {
	var createUser = function(username, password) {
		this.user = new User(username, password);
	};

	var getUser = function() {
		return this.user;
	};

	var addInterests = function(interests) {
		if(!this.user) {
			return;
		}
		this.user.interests = interests;
	};

	var addAdditionalInformation = function(additionalInformation){
		if(!this.user){
			return;
		}
		this.user.first_name = additionalInformation.first_name;
		this.user.last_name = additionalInformation.last_name;
		this.user.country_code = additionalInformation.country_code;
		this.user.dob = additionalInformation.dob;
	};
	
	return {
		createUser : createUser,
		getUser : getUser,
		addInterests: addInterests,
		addAdditionalInformation : addAdditionalInformation	
	};
};

module.exports = UserService;
