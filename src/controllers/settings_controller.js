var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var differ = require('../utils/differ.js');
var zipValidator = require('../utils/zipValidator.js');
var emailValidator = require('../utils/email_validation.js');
var filterObject = require('../utils/filter_object.js');
var SettingsItem = require('../models/settings_item.js');

function city(item) {
  var valid = !!item;
  var message = valid ? undefined : 'Invalid City';
  return {
    valid: valid,
    message: message,
  };
}

function email(item) {
  var valid = emailValidator(item);
  var message = valid ? undefined : 'Invalid Email Address';
  return {
    valid: valid,
    message: message,
  };
}

function alwaysTrue(item) {
  return {
    valid: true,
  };
}

SettingsController = function($scope, $location, $timeout, userService, authService, $rootScope, $anchorScroll) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.userService = userService;
  this.rs = $rootScope;
  this.location = $location;
  this.anchorScroll = $anchorScroll;
  this.timeout = $timeout;
  this.errors = [];
  this.current_password = '';
  this.new_password = '';
  this.autosaved = {
    city: false,
    gender: false,
    dob: false,
    email: false,
    public: false,
    zipcode: false,
  };
  this.showSettings = true;
  this.profilePicture = {
    saving: true,
  };
  var that = this;
  this.getUserSettings(function(err, result) {
    if (err) {
      that.settingsItem = new SettingsItem();
    } else {
      that.settingsItem = SettingsItem.createFromJson(result);
      that.previousValues = SettingsItem.createFromJson(result);
    }
  });

  this.validators = {
    zipcode: function(zip) {
      var valid = zipValidator(zip);
      if (valid) {
        return {
          valid: true,
        };
      }
      return {
        valid: false,
        message: 'Invalid Zip Code',
      };
    },
    city: city,
    email: email,
    gender: alwaysTrue,
    dob: alwaysTrue,
    public: alwaysTrue,
  };

  this.gender_options = [
    {name: 'His', des: 'male'},
    {name: 'Her', des: 'female'},
    {name: 'They', des: 'they'},
  ];
};

SettingsController.prototype.autoSave = function(item) {
  var that = this;
  // Dont try to save if the item is invalid
  if (!this.validators[item](this.settingsItem[item]).valid) {
    return;
  }
  this.saveUserSettings(function(error) {
    if (error) {
      return;
    }
    that.autosaved[item] = true;
    that.timeout(function() {
      that.eraseAutoSave(item);
    }, 1000);
  });
};

SettingsController.prototype.eraseAutoSave = function(item) {
  this.autosaved[item] = false;
};

SettingsController.prototype.getUserSettings = function(callback) {
  this.userService.getUserSettings(callback);
};

function emptyBody(filtered) {
  if (!filtered) {
    return true;
  }
  if (Object.keys(filtered).length === 0 && filtered.constructor === Object) {
    return true;
  }
  return false;
}

// Populates any error messages and returns true if
// any errors were populated.
SettingsController.prototype.populateErrors = function(body) {
  this.errors = [];
  for (var key in body) {
    var validationResult = this.validators[key](body[key]);
    if (!validationResult.valid) {
      this.errors.push(validationResult.message);
    }
  }
  if (this.errors.length > 0) {
    return true;
  }
  return false;
};

SettingsController.prototype.saveUserSettings = function(callback) {
  var params = differ(this.previousValues.toBody(), this.settingsItem.toBody());
  if (this.populateErrors(params)) {
    if (callback) {
      return callback(new Error('Invalid Body'));
    }
    return;
  }
  var filteredParams = filterObject(params);
  if (emptyBody(filteredParams)) {
    this.errors.push('Nothing to Save');
    if (callback) {
      return callback(new Error('Invalid Body'));
    }
    return;
  }
  var that = this;
  this.saving = true;
  this.userService.saveUserSettings(filteredParams, function(err) {
    if (err) {
      that.saving = false;
      that.errors.push('An error occurred while trying to save your settings');
      that.timeout(function() {
        that.errors = [];
      }, 1800);
      if (callback) {
        return callback(err);
      }
    }

    that.saveConfirmed = true;
    that.saving = false;
    that.timeout(function() {
      that.saveConfirmed = false;
    }, 1800);
    if (callback) {
      callback(null);
    }
  });
};

SettingsController.prototype.changePassword = function() {
  this.savingPassword = true;
  this.passwordError = false;
  var params = {
    current_password: this.current_password,
    new_password: this.new_password,
  };
  var that = this;
  this.userService.changePassword(params, function(err, result) {
    that.current_password = '';
    that.new_password = '';
    if (err) {
      that.passwordError = true;
      that.savingPassword = false;
      return;
    }
    that.savingPassword = false;
    that.newPassword = true;
    that.timeout(function() {
      that.newPassword = false;
    }, 1800);
  });
};

// TODO is this used?
SettingsController.prototype.maxDate = function() {
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
  }
  if (day <= 9) {
    day = '0' + day.toString();
  } else {
    day = day.toString();
  }
  year = year.toString();
  return year + '-' + month + '-' + day;
};

SettingsController.prototype.scrollTo = function(hash) {
  this.location.hash(hash);
  this.anchorScroll();
};

SettingsController.prototype.hasCropped = function() {
  this.profilePicture.cropped = true;
};

SettingsController.prototype.saveProfilePicture = function(img) {
  var that = this;
  this.profilePicture.saving = false;
  this.userService.profilePicture(img.img, function(err, res) {
    that.profilePicture.saving = true;
    if (err) {
      that.profilePicture.error = true;
      return;
    }
    that.profilePicture.success = true;
    that.settingsItem.img_url = res.img_url;
    that.rs.user.img_url = res.img_url;
    that.showModal = false;
  });
};

module.exports = SettingsController;
