var countryCodes = require('../utils/countrycodes.json');
function SignUpCtrl ($rootScope, $scope, $location, userService, authService) {
	$scope = $scope || {};
	$scope.signup = this;
	this.userService = userService;
    this.location = $location;
	this.max = this.maxDate();
    var user = this.userService.getUser() || {};
    this.additionalInformation = {
        "first_name": user.first_name || "",
        "last_name": user.last_name || "",
        "dob": user.dob|| "",
        "country_code": "USA"
    };
	this.country = countryCodes;
    this.rs = $rootScope;
    this.loggedIn = $rootScope.loggedIn;
    if(!userService.user) {
        this.location.path('/');
    }

}

SignUpCtrl.prototype.test = function() {
    var that = this;
    this.userService.addAdditionalInformation(this.additionalInformation);
    var user = this.userService.getUser();
    if(!user) {
        that.invalid_user = true;
    }
    else {
        this.userService.saveUser(function(err, result){
            if(err) {
                if(err.status === 409) {
                    that.user_exists_error = true;
                }
                else {
                that.error = true;
                }
            }
            else {
                that.rs.loggedIn = true;
                that.location.path("/feed");
            }
        });
    }
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
