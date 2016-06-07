var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var differ = require('../utils/differ.js');
var zipValidator = require('../utils/zipValidator.js');
var emailValidator = require('../utils/email_validation.js');
var filterObject = require('../utils/filter_object.js');
var SettingsItem = require('../models/settings_item.js');

function alwaysTrue(item) {
  return true;
}

function getErrorsObject() {
  return {
    zipcode: {
      invalid: false,
      message: 'Invalid Zip Code',
    },
    email: {
      invalid: false,
      message: 'Invalid Email Address',
    },
    gender: {
      invalid: false,
    },
    dob: {
      invalid: false,
    },
    public: {
      invalid: false,
    },
    nothingToSave: {
      invalid: false,
      message: 'No changes to make',
    },
    serverError: {
      invalid: false,
      message: 'An error occurred while updating your settings',
    },
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
  this.current_password = '';
  this.new_password = '';
  this.autosaved = {
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

  this.errors = getErrorsObject();

  this.validators = {
    zipcode: zipValidator,
    email: emailValidator,
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
  if (!this.validators[item](this.settingsItem[item])) {
    this.errors[item].invalid = true;
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
  this.errors = getErrorsObject();
  var errored = false;
  for (var key in body) {
    var validationResult = this.validators[key](body[key]);
    if (!validationResult) {
      this.errors[key].invalid = true;
      errored = true;
    }
  }
  return errored;
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
    this.errors.nothingToSave.invalid = true;
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
      that.errors.serverError.invalid = true;
      if (callback) {
        return callback(err);
      }
    }

    that.previousValues = SettingsItem.createFromJson(that.settingsItem.toBody());
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
