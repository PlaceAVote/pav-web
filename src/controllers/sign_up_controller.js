var countryCodes = require('../utils/countrycodes.json');
function SignUpCtrl ($scope, $location, userService) {
	$scope = $scope || this;
	$scope.signup = this;
	this.userService = userService;
	this.max = this.maxDate();

 	this.additionalInformation = { 
	  	"first_name": "",
	   	"last_name": "",
	  	"dob": "",
	 	"country_code": "USA"
	}
	this.country = countryCodes;	
};

SignUpCtrl.prototype.test = function() {
    var that = this;
	this.userService.addAdditionalInformation(this.additionalInformation);
	var user = this.userService.getUser();
    console.log(user);
    this.userService.saveUser(function(err, result){
        if(err) {
            that.error = true;
            console.error(err);
        }
        else {
            //temporary console log to see what is returned from server
            console.log(result);
        }
    });
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
