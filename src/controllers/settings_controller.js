var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var SettingsItem = require('../models/settings_item.js');

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
    city: false,
    gender: false,
    dob: false,
    email: false,
    public: false,
  };
  this.showSettings = true;


  var that = this;
  this.getUserSettings(function(err, result) {
    if (!err) {
      that.settingsItem = SettingsItem.createFromJson(result);

    }
  });

  this.gender_options = [
    {name: 'His', des: 'male'},
    {name: 'Her', des: 'female'},
    {name: 'They', des: 'they'},
  ];
};

SettingsController.prototype.autoSave = function(item) {
  if (item == 'city') {
    if (this.settingsItem.city === '') {
      return;
    }
  }
  if (item == 'email') {
    if (this.settingsItem.email === '') {
      return;
    }
  }
  this.saveUserSettings();
  var that = this;
  if (!this.error) {
    switch (item) {
      case 'city': {
        this.autosaved.city = true;
        break;
      }
      case 'gender': {
        this.autosaved.gender = true;
        break;
      }
      case 'dob': {
        this.autosaved.dob = true;
        break;
      }
      case 'email': {
        this.autosaved.email = true;
        break;
      }
      case 'public': {
        this.autosaved.public = true;
        break;
      }
      default: {
        break;
      }
    }
    this.timeout(function() {
      that.eraseAutoSave(item);
    }, 1000);
  }
};

SettingsController.prototype.eraseAutoSave = function(item) {
  switch (item) {
    case 'city': {
      this.autosaved.city = false;
      break;
    }
    case 'gender': {
      this.autosaved.gender = false;
      break;
    }
    case 'dob': {
      this.autosaved.dob = false;
      break;
    }
    case 'email': {
      this.autosaved.email = false;
      break;
    }
    case 'public': {
      this.autosaved.public = false;
      break;
    }
    default: {
      break;
    }
  }
};

SettingsController.prototype.getUserSettings = function(callback) {
  this.userService.getUserSettings(callback);
};

SettingsController.prototype.saveUserSettings = function() {
  var params = this.settingsItem.toBody();
  var that = this;
  this.saving = true;
  this.userService.saveUserSettings(params, function(err, result) {
    if (err) {
      that.saving = false;
      that.error = err;
    }

    if (result) {
      that.saveConfirmed = true;
      that.saving = false;
      that.timeout(function() {
        that.saveConfirmed = false;
      }, 2000);
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
    if (err) {
      that.passwordError = true;
      that.savingPassword = false;
    }
    if (result) {
      that.savingPassword = false;
      that.newPassword = true;
      that.timeout(function() {
        that.newPassword = false;
      }, 2000);
    }
  });
  this.current_password = '';
  this.new_password = '';
};

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

module.exports = SettingsController;
