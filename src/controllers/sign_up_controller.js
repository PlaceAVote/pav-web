var countryCodes = require('../utils/countrycodes.json');

function SignUpCtrl($rootScope, $scope, $location, userService, authService) {
  $scope = $scope || {};
  $scope.signup = this;
  this.loaded = true;
  this.userService = userService;
  this.location = $location;
  this.max = this.maxDate();
  var user = this.userService.getUser() || {};
  this.additionalInformation = {
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    dob: user.dob || '',
    country_code: 'USA',
    gender: user.gender || 'male',
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
      des: 'His',
    },
    {
      name: 'female',
      des: 'Her',
    },
    {
      name: 'they',
      des: 'They',
    },
  ];
}

SignUpCtrl.prototype.test = function() {
  this.userService.addAdditionalInformation(this.additionalInformation);
  var user = this.userService.getUser();
  if (!user) {
    this.invalid_user = true;
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
        return;
      }
      that.error = true;
      return;
    }
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
