Facebook = function(){

    login = function(callback){
        //ideally move this elsewhere to allow global access to FB
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1686777641544347',
            xfbml      : true,
            version    : 'v2.4'
            });
            FB.getLoginStatus(function(response) {
                var auth = response.authResponse;
                if (response.status === 'connected') {
                    FB.api('/me', {fields: 'first_name, last_name, picture, email, birthday, hometown'}, function(response) {
                        callback(response, auth);
                    });
                }
                else {
                    FB.login(function(response){
                        var auth = response.authResponse;
                        FB.api('/me', {fields: 'first_name, last_name, picture, email, birthday, hometown'}, function(response) {
                            console.log("AUTH", auth);
                            callback(response, auth);
                        });
                    }, {scope: 'email, user_birthday'});
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
    return {
        login: login
    }
}

module.exports = Facebook;
