    function LoginCtrl($scope, $location) {

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

	LoginCtrl.prototype.go = function ( hash ) {
  		this.location.path(hash);
	}
	

	LoginCtrl.prototype.validate = function(u, hash) {

		var email = u.email;
		var password = u.password;
		
		this.user.emailValid = this.emailValidation(email);
		this.user.passwordValid = this.passwordValidation(password);
		
		if(this.user.emailValid && this.user.passwordValid) {
			this.go(hash);		
		} 

	}


	LoginCtrl.prototype.emailValidation = function(email) {
		var e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return e.test(email);
	};

	LoginCtrl.prototype.passwordValidation = function(password) {
		var p = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/;
		return p.test(password);
	}

module.exports = LoginCtrl;
