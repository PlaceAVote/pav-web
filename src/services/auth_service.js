function AuthService() {
  var auth;
  var setAuth = function(token) {
   auth = token;
  };
  var getAccessToken = function() {
    if(!auth) {
      return;
    }
    return auth.accessToken;
  };

  return {
    setAuth: setAuth,
    getAccessToken: getAccessToken,
  };
}

module.exports = AuthService;

