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
  this.invalids = [
    'invalid_first_name',
    'invalid_last_name',
    'invalid_password',
    'invalid_gender',
    'invalid_dob',
    'invalid_zip',
    'invalid_topics',
    'invalid_email',
  ];

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
  if (!date) {
    return;
  }
  if (date instanceof Date) {
    this.additionalInformation.dobFmt = date.getTime().toString();
    return;
  }
  var split = date.split('-');
  if (split.length !== 3) {
    return;
  }
  var componented = [];
  for (var i = 0; i < split.length; i++) {
    var d = parseInt(split[i]);
    if (isNaN(d)) {
      return;
    }
    componented.push(d);
  }
  this.additionalInformation.dobFmt = new Date(componented[2], componented[0] - 1, componented[1]).getTime().toString();
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

  if (!user.dob) {
    this.invalid_dob = true;
  } else {
    this.invalid_dob = false;
  }

  if (!user.first_name) {
    this.invalid_first_name = true;
  } else {
    this.invalid_first_name = false;
  }

  if (!user.last_name) {
    this.invalid_last_name = true;
  } else {
    this.invalid_last_name = false;
  }

  if (!user.gender) {
    this.invalid_gender = true;
  } else {
    this.invalid_gender = false;
  }

  if (!this.zipFormat(user.zipcode)) {
    this.invalid_zip = true;
  } else {
    this.invalid_zip = false;
  }

  var that = this;
  var invalidState;
  this.invalids.forEach(function(invalid) {
    if (that[invalid]) {
      invalidState = true;
      return;
    }
  });
  if (invalidState) {
    return;
  }
  this.saveUser(user);
};


SignUpCtrl.prototype.setErrorsFromResponse = function(err) {
  if (err.status === 409) {
    this.user_exists_error = true;
    this.analytics.trackEvent('Signup', 'Failed: already exists');
    return;
  }
  if (!err.data || !err.data.errors) {
    this.error = true;
    this.analytics.trackEvent('Signup', 'Failed: Error: ' + err.status);
    return;
  }

  // Reset errors
  var that = this;
  this.invalids.forEach(function(invalid) {
    that[invalid] = false;
  });
  // Set errors from response.
  err.data.errors.forEach(function(e) {
    if (e.dob) {
      that.invalid_dob = true;
    }
    if (e.last_name) {
      that.invalid_last_name = true;
    }
    if (e.first_name) {
      that.invalid_first_name = true;
    }
    if (e.email) {
      that.invalid_email = true;
    }
    if (e.password) {
      that.invalid_password = true;
    }
    if (e.topics) {
      that.invalid_topics = true;
    }
    if (e.gender) {
      that.invalid_gender = true;
    }
    if (e.zipcode) {
      that.invalid_zip = true;
    }
  });
  return;
};

SignUpCtrl.prototype.saveUser = function(user) {
  var that = this;
  this.loaded = false;
  this.userService.saveUser(function(err, result) {
    that.loaded = true;
    if (err) {
      that.setErrorsFromResponse(err);
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
