app.controller('UserRegisterCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {

	var userRegister = this;

	userRegister.test = "hello world";
	
	userRegister.go = function ( hash ) {
  		$location.path(hash);
	};

}]);


