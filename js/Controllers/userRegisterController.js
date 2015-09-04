var SignUpCtrl = function($scope, $location) {

	var signup = this;

	
 	signup.user = { 
	 	"password": "stuff",
	  	"email": "tony@place.com",
	  	"first_name": "atony",
	   	"last_name": "montana",
	  	"dob": "01/01/1979",
	 	"country_code": "840"
	}

	console.log(signup.user);

}


	SignUpCtrl.$inject = ['$scope', '$location'];

	app.controller('SignUpCtrl', SignUpCtrl);