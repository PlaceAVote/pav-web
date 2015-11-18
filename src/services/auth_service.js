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
   auth = 'PAV_AUTH_TOKEN ' + token;
   storage.setItem('pav', auth);
  };

  var getFacebookAccessToken = function() {
    if(!facebookAuth) {
      return;
    }
    return facebookAuth.accessToken;
  };

  var getTokenFromLocalStorage = function() {
    return storage.getItem('pav');
  };

  var getAccessToken = function() {
    if (!auth) {
      auth = getTokenFromLocalStorage();
    }
    return auth;
  };

  var loggedInStatus = function() {
    auth = getAccessToken();
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
    config.methods.get.transformResponse = [];
    var authResource = new $resource(url, undefined, {authorize: config.methods.get});
    var onError = function(){
      callback(false);
    }
    var onLoad = function(){
      callback(true);
    }
    authResource.authorize(undefined, onLoad, onError);
  };

  return {
    loggedInStatus: loggedInStatus,
    setAuth: setAuth,
    getAccessToken: getAccessToken,
    setFacebookAuth: setFacebookAuth,
    getFacebookAccessToken: getFacebookAccessToken,
    validateToken: validateToken,
  };
}

module.exports = AuthService;

