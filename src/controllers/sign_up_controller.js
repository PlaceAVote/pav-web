var countryCodes = require('../utils/countrycodes.json');
var zipValidator = require('../utils/zipValidator.js');

function SignUpCtrl($rootScope, $scope, $location, userService, authService, Analytics) {
  $scope = $scope || {};
  $scope.signup = this;
  this.loaded = true;
  this.userService = userService;
  this.location = $location;
  this.analytics = Analytics;
  this.max = this.maxDate();
  var user = this.userService.getUser() || {};
  this.additionalInformation = {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    dob: user.dob || '',
    gender: user.gender,
    zipcode: user.zipcode || '',
  };
  this.country = countryCodes;
  this.rs = $rootScope;
  this.loggedIn = $rootScope.loggedIn;

  if (!userService.user) {
    this.location.path('/');
  }
  this.gender_options = [
    {
      name: 'male',
      des: 'Male',
    },
    {
      name: 'female',
      des: 'Female',
    },
    {
      name: 'they',
      des: 'Non-Binary',
    },
  ];
}

SignUpCtrl.prototype.setDateAsUTCTime = function(date) {
  if (!(date instanceof Date)) {
    return;
  }
  this.additionalInformation.dobFmt = date.getTime().toString();
};

SignUpCtrl.prototype.signup = function() {
  this.setDateAsUTCTime(this.additionalInformation.dob);
  this.userService.addAdditionalInformation(this.additionalInformation);
  var user = this.userService.getUser();
  if (!user) {
    this.invalid_user = true;
  } else {
    this.invalid_user = false;
  }

  if (!this.additionalInformation.gender) {
    this.no_gender = true;
  } else {
    this.no_gender = false;
  }

  if (!this.zipFormat(this.additionalInformation.zipcode)) {
    this.invalid_zip = true;
  } else {
    this.invalid_zip = false;
  }

  if (this.invalid_user || this.no_gender || this.invalid_zip) {
    return;
  }

  this.saveUser(user);
};

SignUpCtrl.prototype.saveUser = function(user) {
  var that = this;
  this.loaded = false;
  this.userService.saveUser(function(err, result) {
    that.loaded = true;
    if (err) {
      if (err.status === 409) {
        that.user_exists_error = true;
        that.analytics.trackEvent('Signup', 'Failed: already exists');
        return;
      }
      that.analytics.trackEvent('Signup', 'Failed: Error: ' + err.status);
      that.error = true;
      return;
    }
    that.analytics.trackEvent('Signup', 'Success');
    that.rs.notLoggedIn = false;
    that.rs.inApp = true;
    if (!user.img_url) {
      user.img_url = 'img/profile/profile-picture.png';
    }
    user.newUser = true;
    that.rs.user = user;
    that.location.path('/feed');
  });
};

SignUpCtrl.prototype.zipFormat = function(zip) {
  return zipValidator(zip);
};

SignUpCtrl.prototype.maxDate = function() {
  var d = new Date();
  var y = d.getFullYear();
  d.setFullYear(y - 18);
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDay();
  month += 1;
  if (month <= 9) {
    month = '0' + month.toString();
  } else {
    month = month.toString();
  } if (day <= 9) {
    day = '0' + day.toString();
  } else {
    day = day.toString();
  }
  year = year.toString();
  return year + '-' + month + '-' + day;
};

module.exports = SignUpCtrl;
