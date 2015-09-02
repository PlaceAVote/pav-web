angular.module('pavApp');
app.controller('LoginCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {

	$scope.login = this;


	$scope.login.user = {
		email: ['', true],
		password: ['', true]
	}

	$scope.login.validate = function(u, hash) {

		//Email Address Regex
		var e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		//Password of atleast one capital and number Regex
		var p = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/;

		var email = u.email[0];
		var password = u.password[0];
		console.log('email: ' + email + ' password: ' + password);
		if(e.test(email) && p.test(password)){
			$scope.login.user.email[0] = email;
			$scope.login.user.password[0] = password;
			$scope.login.user.email[1] = true;
			$scope.login.user.password[1] = true;
			$scope.go(hash);			
		} 

		else if (e.test(email) === false && p.test(password) === false) {
			$scope.login.user.email[1] = false;
			$scope.login.user.password[1] = false;
		} 

		else if (e.test(email) === false) {
			$scope.login.user.email[1] = false;
		} 

		else if (p.test(password) === false ) {
			$scope.login.user.password[1] = false;
		}
	}
	
	$scope.go = function ( hash ) {
  		$location.path(hash);
	};

}]);


	