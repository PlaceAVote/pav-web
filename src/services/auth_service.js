function AuthService() {
  var auth;
  var facebookAuth;

  var setFacebookAuth = function(token){
    facebookAuth = token;
  };

  var setAuth = function(token) {
   auth = token;
   console.log(auth);
  };

  var getFacebookAccessToken = function() {
    if(!facebookAuth) {
      return;
    }
    return facebookAuth.accessToken;
  };

  var getAccessToken = function() {
    if (!auth) {
      return;
    }
    return 'PAV_AUTH_TOKEN ' + auth;
  };

  var loggedInStatus = function() {
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

