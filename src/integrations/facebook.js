var config = require('../config/endpoints.js');

Facebook = function(){
    var facebook;
    /**
     * initialise facebook sdk.  Is registered when service is initialized.
     */
    var init = function(){
        window.fbAsyncInit = function() {
            FB.init({
                appId      : config.facebookAppId,
                xfbml      : true,
                version    : 'v2.4'
            });
            facebook = FB;
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }();

    /**
     * Login to facebook. Checks whether the user is logged in, if not ask
     * user for permissions.  Return user object
     */
    login = function(callback){
        facebook.getLoginStatus(function(response) {
            var auth = response.authResponse;
            if (response.status === 'connected') {
                facebook.api('/me', {fields: 'first_name, last_name, picture, email, birthday, hometown, cover'}, function(response) {
                    callback(response, auth);
                });
            }
            else {
                facebook.login(function(response){
                    var auth = response.authResponse;
                    facebook.api('/me', {fields: 'first_name, last_name, picture, email, birthday, hometown, cover'}, function(response) {
                      var userNode = response;
                      facebook.api('/' + userNode.id + '/picture/?type=large' ,function(response){
                        userNode.picture = response;
                        callback(userNode, auth);
                      });
                    });
                }, {scope: 'email, user_birthday, user_photos'});
            }
        });
    };
    return {
        login: login
    }
}

module.exports = Facebook;
