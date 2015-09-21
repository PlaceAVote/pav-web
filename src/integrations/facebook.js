Facebook = function(){
    return this;
};

Facebook.prototype.login = function(callback){
    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1686777641544347',
            xfbml      : true,
            version    : 'v2.4'
        });
        FB.getLoginStatus(function(response) {
            var auth = response.authResponse;
            if (response.status === 'connected') {
                FB.api('/me', {fields: 'first_name, last_name, picture, email birthday'}, function(response) {
                    callback(response, auth);
                });
            }
            else {
                FB.login(function(response){
                    FB.api('/me', {fields: 'first_name, last_name, picture, email, birthday'}, function(response) {
                        callback(response, auth);
                    });
                }, {scope: 'email, public_profile, user_birthday'});
            }
        });
    };
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    return this;
};



module.exports = Facebook;
