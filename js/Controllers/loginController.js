angular.module('pavApp');

	
    var LoginCtrl = function($scope, $location) {

		var login = this;

		login.forgot = false;
		login.passwordSent = false;


		login.user = {
			email: '',
			emailValid: true,
			password: '',
			passwordValid: true
		}


		$scope.validate = function() {
			login.validate();
		}

		login.go = function ( hash ) {
  			$location.path(hash);
		}
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





	LoginCtrl.$inject = ['$scope', '$location'];

	app.controller('LoginCtrl', LoginCtrl);