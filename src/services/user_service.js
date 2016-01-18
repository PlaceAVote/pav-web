var User = require('../models/user.js');
var config = require('../config/endpoints.js');
var strftime = require('strftime');
var TimelineResponseFactory = require('../factories/timeline_response_factory.js');

function UserService($resource, facebookService, authService) {
  this.createdFB = false;
  var loginWithFacebook = function(callback) {
    var that = this;
    var onLoad = function(resource) {
      authService.setAuth(resource.token);
      callback(undefined, resource);
    };
    var onError = function(err) {
      that.createdFB = true;
      callback(err, that.user);
    };

    facebookService.login(function(resource, auth) {
      if (!auth) {
        return callback({status: 999, message: 'No Facebook Authentication'});
      }
      authService.setFacebookAuth(auth);
      that.user = new User(resource.email);
      that.user.dob = new Date(resource.birthday);
      that.user.first_name = resource.first_name;
      that.user.last_name = resource.last_name;
      that.user.img_url = resource.picture.data.url;
      that.user.gender = resource.gender;
      var authToken = authService.getFacebookAccessToken();
      config.methods.post.headers.Authorization = authToken;
      var facebookUserLoginResource = new $resource(config.users.facebookLoginUrl, undefined, {login: config.methods.post});
      var creds = {
        id: resource.id,
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
    if (!this.user) {
      return;
    }
    this.user.topics = topics;
  };

  var getTopics = function() {
    return this.user.topics;
  };

  var addAdditionalInformation = function(additionalInformation) {
    if (!this.user) {
      return;
    }
    this.user.first_name = additionalInformation.first_name;
    this.user.last_name = additionalInformation.last_name;
    this.user.country_code = additionalInformation.country_code;
    this.user.dob = strftime('%m/%d/%Y', additionalInformation.dob);
    this.user.gender = additionalInformation.gender;
  };

  var makeProfilePublic = function() {
    if (!this.user) {
      return;
    }
    if (this.user.private === false) {
      this.user.private = true;
    } else if (this.user.private === true) {
      this.user.private = false;
    }
  };

  var getSaveConfig = function(user) {
    if (user.password) {
      return config.users.endpoint;
    }
    return config.users.facebookCreateUrl;
  };
  var saveUser = function(callback) {
    var that = this;

    var onLoad = function(user) {
      authService.setAuth(user.token);
      callback(undefined, user);
    };
    var onError = function(err) {
      callback(err);
    };
    if (!this.user) {
      return;
    }
    var url = getSaveConfig(this.user);
    var saveUser = new $resource(url, undefined, {create: config.methods.put});

    var token = authService.getFacebookAccessToken();
    var userId = authService.getFacebookId();
    var toSave = this.user.toBody(token, userId);
    saveUser.create(toSave, onLoad, onError);
  };


  var login = function(user, callback) {

    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }

    var onLoad = function(response) {
      authService.setAuth(response.token);
      return callback(undefined, response);
    };

    var onError = function(err) {
      return callback(err);
    };

    if (!user || !user.email || !user.password) {
      return callback({message: 'User has no password or username'});
    }
    config.methods.post.headers.Authorization = token;
    var loginResource = new $resource(config.users.login_endpoint, undefined, {login: config.methods.post});
    loginResource.login(user, onLoad, onError);
  };

  var getUserProfile = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (this.user && this.user.loadedFromServer) {
      return callback(undefined, this.user);
    }

    var url = config.users.profile.fromId(id);
    config.methods.get.headers.Authorization = token;
    var profileResource = new $resource(url, undefined, {getProfile: config.methods.get});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(result) {
      this.user = User.createFromJson(result);
      return callback(undefined, this.user);
    };
    profileResource.getProfile(undefined, onLoad, onError);
  };

  var getUserFromId = function(id, callback) {
    if (!id) {
      return callback({message: 'Must Supply User Id'});
    }
    var token = authService.getAccessToken();
    if (!token) {
      return callback({status: 401, message: 'No Auth Token'});
    }
    var url = config.users.profile.fromId(id);
    var resource = new $resource(url, undefined, {getProfile: config.methods.get});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(result) {
      return callback(undefined, User.createFromJson(result));
    };
    resource.getProfile(undefined, onLoad, onError);
  };

  var getUserTimeline = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!id) {
      return callback({message: 'Id is required'});
    }
    var url = config.users.timeline(id);
    config.methods.get.headers.Authorization = token;
    var timelineResource = new $resource(url, undefined, {getTimeline: config.methods.get});
    var onError = function(error) {
      return callback({message: 'Server Error', error: error});
    };
    var onLoad = function(response) {
      try {
        var results = {
          next_page: response['next-page'],
          timeline: TimelineResponseFactory.getResponses(response.results),
        };
        return callback(undefined, results);
      }
      catch (e) {
        return callback(e);
      }
    };
    timelineResource.getTimeline(undefined, onLoad, onError);
  };

  var getFollowers = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!id) {
      return callback({message: 'Id is required'});
    }
    var url = config.users.followers(id);
    config.methods.getArray.headers.Authorization = token;
    var followersResource = new $resource(url, undefined, {getFollowers: config.methods.getArray});
    var onError = function(error) {
      return callback({message: 'Server Error', error: error});
    };
    var onLoad = function(response) {
      var users = [];
      for (var i = 0; i < response.length; i++) {
        users.push(User.createFromJson(response[i]));
      }
      return callback(undefined, users);
    };
    followersResource.getFollowers(undefined, onLoad, onError);
  };

  var getFollowing = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!id) {
      return callback({message: 'Id is required'});
    }
    var url = config.users.following(id);
    config.methods.getArray.headers.Authorization = token;
    var followersResource = new $resource(url, undefined, {getFollowing: config.methods.getArray});
    var onError = function(error) {
      return callback({message: 'Server Error', error: error});
    };
    var onLoad = function(response) {
      var users = [];
      for (var i = 0; i < response.length; i++) {
        users.push(User.createFromJson(response[i]));
      }
      return callback(undefined, users);
    };
    followersResource.getFollowing(undefined, onLoad, onError);
  };

  var follow = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!id) {
      return callback({message: 'Id is Required'});
    }
    var url = config.users.follow;
    config.methods.putNoBody.headers.Authorization = token;
    var resource = new $resource(url, undefined, {execute: config.methods.putNoBody});
    var onError = function(err) {
      return callback({message: 'Server Error', error: err});
    };
    var onLoad = function(result) {
      return callback(undefined, true);
    };
    var body = {
      user_id: id,
    };
    resource.execute(body, onLoad, onError);
  };

  var unfollow = function(id, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!id) {
      return callback({message: 'Id is Required'});
    }
    var url = config.users.unfollow;
    var body = {
      user_id: id,
    };
    var resource = new $resource(url, undefined, {execute: config.methods.del.delete(body, token)});
    var onError = function(err) {
      return callback({message: 'Server Error', error: err});
    };
    var onLoad = function(result) {
      return callback(undefined, true);
    };
    resource.execute(body, onLoad, onError);
  };

  return {
    createUser: createUser,
    getUser: getUser,
    getTopics: getTopics,
    addTopics: addTopics,
    addAdditionalInformation: addAdditionalInformation,
    saveUser: saveUser,
    login: login,
    loginWithFacebook: loginWithFacebook,
    makeProfilePublic: makeProfilePublic,
    getUserProfile: getUserProfile,
    getUserFromId: getUserFromId,
    getUserTimeline: getUserTimeline,
    getFollowers: getFollowers,
    getFollowing: getFollowing,
    follow: follow,
    unfollow: unfollow,
  };
}

module.exports = UserService;

