var User = require('../models/user.js');
var config = require('../config/live_endpoints.js');
var strftime = require('strftime');

function UserService($resource, facebookService) {
    this.createdFB = false;
    var loginWithFacebook = function(callback){
        var that = this;
        var onLoad = function(resource) {
            callback(undefined, resource);
        };
        var onError = function(err) {
            that.createdFB = true;
            callback(err, that.user);
        };

        facebookService.login(function(resource, auth){
            that.userToken = auth;
            that.user = new User(resource.email);
            that.user.dob = new Date(resource.birthday);
            that.user.first_name = resource.first_name;
            that.user.last_name = resource.last_name;
            that.user.img_url = resource.picture.data.url;
            config.methods.post.headers["PAV_AUTH_TOKEN"] = auth.accessToken;
            var facebookUserLoginResource = new $resource(config.users.facebookLoginUrl, undefined, {login : config.methods.post});
            var creds = {
                email: that.user.email,
                token: that.userToken.accessToken
            }
            facebookUserLoginResource.login(creds, onLoad, onError);
        });
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

    var makeProfilePublic = function(){
        if(!this.user) {
            return;
        }
        if(this.user.private === false){
            this.user.private = true;
        }
        else if(this.user.private === true){
            this.user.private = false;
        }
    };

    var getSaveConfig = function(throughFacebook){
      if(throughFacebook){
        return config.users.facebookCreateUrl;
      }
      else {
        return config.users.endpoint;
      }
    };
    var saveUser = function(callback){
        var that = this;

        var onLoad = function(user){
            this.usertoken = user.token;
            callback(undefined, user);
        };
        var onError = function(err){
            callback(err);
        };
        if(!this.user){
            return;
        }
        var url = getSaveConfig(this.createdFB);
        var saveUser = new $resource(url, undefined, {create : config.methods.put});
        var token;
        if(this.userToken){
            token = this.userToken.accessToken;
        }
        var toSave = this.user.toBody(token);
        saveUser.create(toSave, onLoad, onError);
    };


    var login = function(user, callback) {

        var onLoad = function(response) {
            this.usertoken = response.token;
            return callback(undefined, response);
        };

        var onError = function(err) {
            return callback(err);
        }

        if(!user || !user.email || !user.password) {
            return callback({message: "User has no password or username"});
        }
        var loginResource = new $resource(config.users.login_endpoint, undefined, {login : config.methods.post});
        loginResource.login(user, onLoad, onError);
    }

	return {
		createUser : createUser,
		getUser : getUser,
		addTopics: addTopics,
		addAdditionalInformation : addAdditionalInformation,
        saveUser : saveUser,
        login : login,
        loginWithFacebook : loginWithFacebook,
        makeProfilePublic: makeProfilePublic
	};
};

module.exports = UserService;

