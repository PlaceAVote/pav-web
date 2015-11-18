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
    config.methods.get.transformResponse = [];
    var authResource = new $resource(url, undefined, {authorize: config.methods.get});
    var onError = function(err){
      storage.removeItem('pav');
      return callback(false);
    }
    var onLoad = function(){
      return callback(true);
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

