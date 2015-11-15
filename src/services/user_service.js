var User = require('../models/user.js');
var config = require('../config/live_endpoints.js');
var strftime = require('strftime');

function UserService($resource, facebookService, authService) {
    this.createdFB = false;
    var loginWithFacebook = function(callback){
        var that = this;
        var onLoad = function(resource) {
            authService.setAuth(resource.token);
            callback(undefined, resource);
        };
        var onError = function(err) {
            that.createdFB = true;
            callback(err, that.user);
        };

        facebookService.login(function(resource, auth){
            authService.setFacebookAuth(auth);
            that.user = new User(resource.email);
            that.user.dob = new Date(resource.birthday);
            that.user.first_name = resource.first_name;
            that.user.last_name = resource.last_name;
            that.user.img_url = resource.picture.data.url;
            var authToken = authService.getFacebookAccessToken();
            config.methods.post.headers["Authorization"] = authToken;
            var facebookUserLoginResource = new $resource(config.users.facebookLoginUrl, undefined, {login : config.methods.post});
            var creds = {
                email: that.user.email,
                token: authToken,
            };
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

    var getTopics = function() {
        return this.user.topics;
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
            authService.setAuth(user.token);
            callback(undefined, user);
        };
        var onError = function(err){
            callback(err);
        };
        if(!this.user){
            return;
        }
        var url = getSaveConfig(this.createdFB);
        config.methods.put.headers["Authorization"] = authService.getAccessToken();
        var saveUser = new $resource(url, undefined, {create : config.methods.put});
        var token = authService.getFacebookAccessToken();
        var toSave = this.user.toBody(token);
        saveUser.create(toSave, onLoad, onError);
    };


    var login = function(user, callback) {

        var onLoad = function(response) {
            authService.setAuth(response.token);
            return callback(undefined, response);
        };

        var onError = function(err) {
            return callback(err);
        };

        if(!user || !user.email || !user.password) {
            return callback({message: "User has no password or username"});
        }
        config.methods.post.headers["Authorization"] = authService.getAccessToken();
        var loginResource = new $resource(config.users.login_endpoint, undefined, {login : config.methods.post});
        loginResource.login(user, onLoad, onError);
    };

    var getUserProfile = function(callback) {
      var token = authService.getAccessToken();
      if(!token) {
        callback({status: 401, message: 'No Auth Token'});
        return;
      }
      if (this.user && this.user.loadedFromServer) {
        return callback(undefined, this.user);
      }
      config.methods.get.headers["Authorization"] = token;
      var profileResource = new $resource(config.users.endpoint, undefined, {getProfile: config.methods.get});
      var onError = function(err){
       return callback(err);
      }
      var onLoad = function(result) {
        this.user = User.createFromJson(result);
        return callback(undefined, this.user);
      }
      profileResource.getProfile(undefined, onLoad, onError);
    };

	return {
    createUser : createUser,
    getUser : getUser,
    getTopics : getTopics,
    addTopics : addTopics,
    addAdditionalInformation : addAdditionalInformation,
    saveUser : saveUser,
    login : login,
    loginWithFacebook : loginWithFacebook,
    makeProfilePublic: makeProfilePublic,
    getUserProfile: getUserProfile,
	};
}

module.exports = UserService;

