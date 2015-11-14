function AuthService(options) {
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
      return getTokenFromLocalStorage();
    }
    return auth;
  };

  var loggedInStatus = function() {
    auth = getTokenFromLocalStorage();
    if(!auth) {
      return false;
    } else if (auth) {
      return true;
    }
  };

  return {
    loggedInStatus: loggedInStatus,
    setAuth: setAuth,
    getAccessToken: getAccessToken,
    setFacebookAuth: setFacebookAuth,
    getFacebookAccessToken: getFacebookAccessToken,
  };
}

module.exports = AuthService;

