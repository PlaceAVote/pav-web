var User = require('../models/user.js');
var config = require('../config/endpoints.js');

function UserService($resource) {

    var createUser = function(username, password) {
		this.user = new User(username, password);
	};

	var getUser = function() {
		return this.user;
	};

	var addTopics = function(topics) {
		if(!this.user) {
			return;
		}
		this.user.topics = topics;
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

    var saveUser = function(callback){
        var onLoad = function(user){
            callback(undefined, user);
        };
        var onError = function(err){
            callback(err);
        };
        if(!this.user){
            return;
        }
        console.log(this.user);
        var saveUser = new $resource(config.users.endpoint, undefined, {create : config.users.create});
        saveUser.create(this.user, onLoad, onError);

    };
	
	return {
		createUser : createUser,
		getUser : getUser,
		addTopics: addTopics,
		addAdditionalInformation : addAdditionalInformation,
        saveUser : saveUser
	};
};

module.exports = UserService;
