var countryCodes = require('../utils/countrycodes.json');
function SignUpCtrl ($scope, $location) {
	$scope = $scope || this;
	$scope.signup = this;
	this.max = this.maxDate();

 	this.user = { 
	 	"password": "",
	  	"email": "",
	  	"first_name": "",
	   	"last_name": "",
	  	"dob": "",
	 	"country_code": "840"
	}
	this.country = countryCodes;	
};

SignUpCtrl.prototype.test = function() {
	console.log(ths.user);
};

SignUpCtrl.prototype.maxDate = function() {
	var d = new Date();
	var y = d.getFullYear();
	d.setFullYear(y-18);
	var year = d.getFullYear();
	var month = d.getMonth();
	var day = d.getDay();
	month += 1;
	if(month<=9) {
		month = '0' + month.toString();
	}
	else {
		month = month.toString();
	}
	if(day<=9) {  	
		day = '0' + day.toString();
	}
	else {
		day = day.toString();   	
	}
	year = year.toString();
	return year + "-" + month + "-" + day;
};

module.exports = SignUpCtrl;
