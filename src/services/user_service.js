var User = require('../models/user.js');
var config = require('../config/endpoints.js');
var strftime = require('strftime');
var TimelineResponseFactory = require('../factories/timeline_response_factory.js');

function UserService($resource, facebookService, authService, userStore) {

  users = userStore || {};
  var loginWithFacebook = function(callback) {
    var that = this;
    var onLoad = function(resource) {
      users.me = resource;
      authService.setAuth(resource.token);
      callback(undefined, resource);
    };
    var onError = function(err) {
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
      that.user.setFacebookToken(auth.accessToken);
      that.user.setFaceBookId(resource.id);

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
    if (!this.user) {
      return;
    }
    return this.user.topics;
  };

  var addAdditionalInformation = function(additionalInformation) {
    if (!this.user) {
      return;
    }
    this.user.first_name = additionalInformation.first_name;
    this.user.last_name = additionalInformation.last_name;
    this.user.zipcode = additionalInformation.zipcode;
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
    if (user.facebookId && user.facebookToken) {
      return config.users.facebookCreateUrl;
    }
    return config.users.endpoint;
  };

  function generateSaveUserRequest(user) {
    url = getSaveConfig(user);
    payload = user.toBody(user);
    return {
      url: url,
      payload: payload,
    };
  }

  var saveUser = function(callback) {
    var that = this;
    var onLoad = function(user) {
      users.me = user;
      authService.setAuth(user.token);
      callback(undefined, user);
    };

    var onError = function(err) {
      console.log(err.status + 'Unable to save user', 'Facebook Sign Up:');
      callback(err);
    };

    if (!this.user) {
      return;
    }

    var request = generateSaveUserRequest(this.user);

    var save = new $resource(request.url, undefined, {create: config.methods.put});
    save.create(request.payload, onLoad, onError);
  };


  var login = function(user, callback) {

    var onLoad = function(response) {

      users.me = response;
      authService.setAuth(response.token);
      return callback(undefined, response);
    };

    var onError = function(err) {
      return callback(err);
    };

    if (!user || !user.email || !user.password) {
      return callback({message: 'User has no password or username'});
    }
    user.email = user.email.toLowerCase();
    var loginResource = new $resource(config.users.loginEndpoint, undefined, {login: config.methods.post});
    loginResource.login(user, onLoad, onError);
  };

  var getUserProfile = function(id, callback) {
    var token = authService.getAccessToken();

    // This has no effect in actual product.
    if (this.user && this.user.loadedFromServer) {
      return callback(undefined, this.user);
    }

    var url;

    if (token) {
      config.methods.get.headers.Authorization = token;
      url = config.users.profile.fromId(id);
    } else {
      url = config.users.profile.fromId(id);
    }

    var profileResource = new $resource(url, undefined, {getProfile: config.methods.get});

    var onError = function(err) {
      return callback(err);
    };

    var onLoad = function(result) {
      // Be wary of this.
      if (!users || !users.me) {
        users.me = result;
      }
      this.user = User.createFromJson(result);

      return callback(undefined, this.user);
    };

    if (id === 'me' && !token) {
      return callback('err');
    }

    profileResource.getProfile(undefined, onLoad, onError);

  };


  var getUserSettings = function(callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }

    var url = config.users.settings;
    config.methods.get.headers.Authorization = token;
    var settingsResource = new $resource(url, undefined, {getSettings: config.methods.get});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(result) {
      return callback(undefined, result);
    };
    settingsResource.getSettings(undefined, onLoad, onError);
  };

  var saveUserSettings = function(body, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }

    if (!body) {
      callback({message: 'Must Supply Settings param'});
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };
    var onError = function(err) {
      callback(err);
    };

    var url = config.users.settings;
    config.methods.post.headers.Authorization = token;
    var settingsResource = new $resource(url, undefined, {save: config.methods.post});
    settingsResource.save(body, onLoad, onError);
  };

  var changePassword = function(body, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }

    if (!body) {
      callback({message: 'Must Supply password params'});
      return;
    }

    var onLoad = function(result) {
      callback(undefined, result);
    };
    var onError = function(err) {
      callback(err);
    };

    var url = config.password.change;
    config.methods.post.headers.Authorization = token;
    var passwordResource = new $resource(url, undefined, {save: config.methods.post});
    passwordResource.save(body, onLoad, onError);
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

  var getUserTimeline = function(timestamp, id, callback) {
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
    body = {};
    if (timestamp) {
      body.from = timestamp;
    }
    var timelineResource = new $resource(url, body, {getTimeline: config.methods.get});
    var onError = function(error) {
      return callback({message: 'Server Error', error: error});
    };

    var onLoad = function(response) {
      try {
        var results = {
          last_timestamp: response.last_timestamp,
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

  var profilePicture = function(img, callback) {
    var token = authService.getAccessToken();
    if (!token) {
      callback({status: 401, message: 'No Auth Token'});
      return;
    }
    if (!img) {
      return callback({message: 'img is Required'});
    }
    var url = config.users.profilePicture;

    var body = {
      file: img,
    };

    var resource = new $resource(url, undefined, {execute: config.methods.postData(body,token)});
    var onError = function(err) {
      return callback(err);
    };
    var onLoad = function(result) {
      return callback(undefined, result);
    };
    resource.execute(body,onLoad, onError);
  };

  /**
   * Check whether the email is in use.
   * returns false if the email can not be used
   * or true if the email can be used.
   */
  var checkEmail = function(email, callback) {
    if (!email) {
      return callback(false);
    }
    var url = config.users.validate;
    var resource = new $resource(url, undefined, { execute: config.methods.post});

    var onLoad = function() {
      return callback(true);
    };
    var onError = function() {
      return callback(false);
    };
    resource.execute(undefined, onLoad, onError);


    };

  var isUserMe = function(id, users) {
    if (id === 'me') {
      return true;
    }
    if (!users) {
      return false;
    }
    if (users.me && users.me.user_id === id) {
      return true;
    }
    return false;
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
    checkEmail: checkEmail,
    getUserProfile: getUserProfile,
    getUserSettings: getUserSettings,
    saveUserSettings: saveUserSettings,
    changePassword: changePassword,
    getUserFromId: getUserFromId,
    getUserTimeline: getUserTimeline,
    getFollowers: getFollowers,
    getFollowing: getFollowing,
    follow: follow,
    unfollow: unfollow,
    profilePicture: profilePicture,
    isUserMe: function(id) {
      return isUserMe(id, users);
    },
  };
}

module.exports = UserService;

