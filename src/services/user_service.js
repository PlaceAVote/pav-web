var User = require('../models/user.js');
var config = require('../config/live_endpoints.js');
var strftime = require('strftime');
var facebook = require('../integrations/facebook.js');

function UserService($resource) {
    var loginWithFacebook = function(){
        var facebook = new Facebook();
        facebook.login();
    };

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
		this.user.dob = strftime('%m/%d/%Y', additionalInformation.dob);
	};
    
    var saveUser = function(callback){
        var that = this;
        var extractTopicNames = function(topics){
            var names = [];
            if(topics){
                var topicLength = topics.length;
                for(var i = topicLength-1; i>=0; i--) {
                    names.push(topics[i].name);
                };
            }
            return names;
        };

        var onLoad = function(user){
            that.user.setToken(user.token);
            callback(undefined, user);
        };
        var onError = function(err){
            callback(err);
        };
        if(!this.user){
            return;
        }
        var saveUser = new $resource(config.users.create_endpoint, undefined, {create : config.users.create});
        var toSave = {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            country_code: this.user.country_code,
            password: this.user.password,
            dob: this.user.dob,
            topics: extractTopicNames(this.user.topics),
            email: this.user.email
        };
        saveUser.create(toSave, onLoad, onError);

    };

    var login = function(user, callback) {

        var onLoad = function(response) {
            return callback(undefined, response);
        };

        var onError = function(err) {
            return callback(err);
        }

        if(!user || !user.email || !user.password) {
            return callback({message: "User has no password or username"});
        }
        var loginResource = new $resource(config.users.login_endpoint, undefined, {login : config.users.login});
        loginResource.login(user, onLoad, onError);
    }

	return {
		createUser : createUser,
		getUser : getUser,
		addTopics: addTopics,
		addAdditionalInformation : addAdditionalInformation,
        saveUser : saveUser,
        login : login,
        loginWithFacebook : loginWithFacebook
	};
};

module.exports = UserService;
