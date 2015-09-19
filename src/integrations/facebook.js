Facebook = function(){
    this.initialized = false;
    return this;
};


Facebook.prototype.getUser = function(response) {
    console.log(JSON.stringify(response));
    this.FB.api('/me', function(response) {
        console.log(JSON.stringify(response));
    });
};

Facebook.prototype.login = function(callback){
    var that = this;
    if(!this.initialized) {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1686777641544347',
                xfbml      : true,
                version    : 'v2.4'
            });
            this.FB = FB;
            FB.getLoginStatus(function(response) {
                console.log(JSON.stringify(response));
                if (response.status === 'connected') {
                    console.log('Logged in.');
                    FB.api('/me', {fields: 'first_name, last_name, picture, email'}, function(response) {
                           console.log(response);
                    });
                }
                else {
                    FB.login(that.getUser, {scope: 'email'});
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
        this.initialised = true;
    }
    return this;
};



module.exports = Facebook;
