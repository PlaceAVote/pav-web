function AuthService() {
  var auth;
  var facebookAuth;

  var setFacebookAuth = function(token){
    facebookAuth = token;
  };

  var setAuth = function(token) {
   auth = token;
  };

  var getFacebookAccessToken = function() {
    if(!facebookAuth) {
      return;
    }
    return facebookAuth.accessToken;
  };

  var getAccessToken = function() {
    return auth;
  };

  return {
    setAuth: setAuth,
    getAccessToken: getAccessToken,
    setFacebookAuth: setFacebookAuth,
    getFacebookAccessToken: getFacebookAccessToken,
  };
}

module.exports = AuthService;

