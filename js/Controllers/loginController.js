angular.module('pavApp');
app.controller('LoginCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {

	$scope.login = this;


	$scope.login.user = {
		email: '',
		password: ''
	}

	$scope.login.validate = function(u) {
		//Email Address Regex
		var e = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		//Password of atleast one capital and number Regex
		var p = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/;

		var email = u['email'];
		var password = u['password'];

		if(e.test(email) && p.test(password)){

			//check against exisiting emails
			//go to topic selection

		} else if (e.test(email) === false) {
			return $scope.login.user.email = false;
		} else if (p.test(password) === false ) {
			return $scope.login.user.password = false;
		}
	}
	
	$scope.go = function ( hash ) {
  		$location.path(hash);
	};

}]);


