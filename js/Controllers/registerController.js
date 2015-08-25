app.controller('TopicRegisterCtrl', ['$scope','$location', 'userAuth', function($scope, $location, userAuth) {

	var topicsRegister = this;

	
	$scope.go = function ( hash ) {
  		$location.path(hash);
	};

}]);


