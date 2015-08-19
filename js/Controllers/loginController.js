app.controller('loginController', ['$scope', 'loginUser', function($scope, loginUser) {

	var login = this;

	login.message = 'Democracy is the best thing since democracy';

	login.user = {
		email: '',
		password: ''
	}

	//Dummy Service Awaiting API endpoint
	login.loginService = function(email, password) {
		if (email == "user@test.com" && password == "password") {
			console.log('sucess');
		} else {
			console.log('fail');
			login.invalid = true;
		}
	}

	login.signIn = function() {
		login.loginService(login.user.email, login.user.password);
	}

}]);


