app.controller('loginController', ['$scope', 'userAuth', function($scope, userAuth) {

	var login = this;

	login.message = 'Democracy is the best thing since democracy';

	//Dummy authentication method
	login.loginService = function(email, password) {

		login.userIsValid = userAuth.userAuthenticate();


		if (email == login.userIsValid.email && password == login.userIsValid.password) {
		 	console.log('sucess really?');
		 } else {
		 	console.log('fail');
		 	login.invalid = true;
		 }
	}

	login.signIn = function() {
		login.loginService(login.user.email, login.user.password);
	}

}]);


