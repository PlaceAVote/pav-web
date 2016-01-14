var config = require('../config/endpoints.js');

function AuthService($resource, options) {
  options = options || {};
  var w = options.window || window;
  var auth;
  var facebookAuth;
  var storage = w.localStorage || {};

  var setFacebookAuth = function(token){
    facebookAuth = token;
  };

  var setAuth = function(token) {
   auth = token;
   storage.setItem('pav', auth);
  };

  var getFacebookAccessToken = function() {
    if(!facebookAuth) {
      return;
    }
    return facebookAuth.accessToken;
  };

  var getFacebookId = function() {
    if(!facebookAuth) {
      return;
    }
    return facebookAuth.userID;
  };
  var getTokenFromLocalStorage = function() {
    return storage.getItem('pav');
  };

  var getAccessToken = function() {
    return 'PAV_AUTH_TOKEN ' +  getRawAccessToken();
  };

  var getRawAccessToken = function() {
    if (!auth) {
      auth = getTokenFromLocalStorage();
    }
    return auth;
  };

  var loggedInStatus = function() {
    auth = getRawAccessToken();
    if(!auth) {
      return false;
    } else if (auth) {
      return true;
    }
  };

  var validateToken = function(callback) {
    var token = loggedInStatus();
    if(!token){
      callback(token);
      return;
    }
    var url = config.users.authorize + auth;
    var authResource = new $resource(url, undefined, {authorize: config.methods.getStatus});
    var onError = function(err){
      storage.removeItem('pav');
      return callback(false);
    }
    var onLoad = function(){
      return callback(true);
    }
    authResource.authorize(undefined, onLoad, onError);
  };

  var logout = function(callback) {
    storage.removeItem('pav');
    auth = undefined;
    callback(undefined, true);
  };

  return {
    loggedInStatus: loggedInStatus,
    setAuth: setAuth,
    getAccessToken: getAccessToken,
    getRawAccessToken: getRawAccessToken,
    setFacebookAuth: setFacebookAuth,
    getFacebookAccessToken: getFacebookAccessToken,
    getFacebookId: getFacebookId,
    validateToken: validateToken,
    logout: logout,
  };
}

module.exports = AuthService;

