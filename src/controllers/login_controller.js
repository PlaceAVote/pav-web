function LoginCtrl($scope, $location, userService) {
	$scope = $scope || {};
	this.userService = userService;
	$scope.login = this;
	this.location = $location;
	this.forgot = false;
	this.passwordSent = false;

	this.user = {
		email: '',
		emailValid: true,
		password: '',
		passwordValid: true
	}
}

LoginCtrl.prototype.loginWithFacebook = function(){
    var that = this;
    this.userService.loginWithFacebook(function(err, response){
        if(err){
            if(err.message === "User Not Found"){
                that.go('/topics');
            }
        }
        else {
            that.go('/feed');
        }
    });
};

LoginCtrl.prototype.go = function (hash) {
 	this.location.path(hash);
}
	

LoginCtrl.prototype.validate = function(u, hash) {
	var email = u.email;
	var password = u.password;
	this.user.emailValid = this.emailValidation(email);
	this.user.passwordValid = this.passwordValidation(password);	
	if(this.user.emailValid && this.user.passwordValid) {
		this.userService.createUser(email, password);
		this.go(hash);		
	} 

};

LoginCtrl.prototype.login = function(u, hash) {
    console.log("in login");
    var email = u.email;
    var password = u.password;
    this.user.emailValid = this.emailValidation(email);
    this.user.passwordValid = this.passwordValidation(password);	
    if(this.user.emailValid && this.user.passwordValid) {
        this.userService.login({email: email, password: password}, function(err, response){
            ///this.go(hash);
            if (err) {
                console.log("**ERROR: ", err);
            } else {
                console.log("**Response: ", response);
            }
        });
    }
};

LoginCtrl.prototype.emailValidation = function(email) {
	var e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return e.test(email);
};

LoginCtrl.prototype.passwordValidation = function(password) {
	var p = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/;
	return p.test(password);
};

module.exports = LoginCtrl;
