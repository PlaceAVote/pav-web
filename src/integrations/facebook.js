var config = require('../config/endpoints.js');

Facebook = function() {
  var facebook;
  // The fields we request from facebook.
  var fields = {
    fields: 'first_name, last_name, picture, email, birthday, hometown, cover, gender',
  };

  /**
   * Initialise facebook sdk.  Is registered when service is initialized.
   */
  var init = function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId: config.facebookAppId,
        xfbml: true,
        version: 'v2.4',
      });
      facebook = FB;
    };
    (function(d, s, id) {
      var js;
      var fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }

      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }();


  /**
   * Private internal method. Gets a users picture from a userNode.
   */
  var getUserPicture = function(auth, userNode, callback) {
    facebook.api('/' + userNode.id + '/picture/?type=large' ,function(response) {
      userNode.picture = response;
      callback(userNode, auth);
    });
  };

  /**
   * Private Method. Gets user profile from Facebook once logged in.
   */
  var getUserProfile = function(auth, callback) {
    facebook.api('/me', fields, function(response) {
      var userNode = response;
      getUserPicture(auth, userNode, callback);
    });
  };

  /**
   * Private internal method to this intergration.
   * Is called by the login method to log the user
   * In to facebook.
   */
  var loginToFacebook = function(callback) {
    var scope = {
      scope: 'email, user_birthday, user_photos',
    };

    facebook.login(function(response) {
      var auth = response.authResponse;
      getUserProfile(auth, callback);
    }, scope);
  };

  /**
   * Exposed Public Mehtod. Checks whether the user is logged in, if not ask
   * user for permissions.  Return user object
   */
  var login = function(callback) {
    facebook.getLoginStatus(function(response) {
      var auth = response.authResponse;
      if (response.status === 'connected') {
        getUserProfile(auth, callback);
      } else {
        loginToFacebook(callback);
      }
    });
  };

  var share = function(url) {
    facebook.ui({
      method: 'share',
      href: url,
    }, function(response) {
      console.log(url);
    });
  };

  return {
    login: login,
    share: share,
  };
};

module.exports = Facebook;
