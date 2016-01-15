var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var SettingsItem = require('../models/settings_item.js');

SettingsController = function($scope, $location, userService, authService, $rootScope) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.userService = userService;
  this.rs = $rootScope;

  this.current_password = "";
  this.new_password = "";

  var that = this;
  this.getUserSettings(function(err, result) {
    if (!err) {
      console.log(result);
      that.settingsItem = SettingsItem.createFromJson(result);

    }
  });

  this.gender_options = [
    {name: "male", des: "male"},
    {name: "female", des: "female"},
    {name: "they", des: "they"}
  ];
}

SettingsController.prototype.getUserSettings = function(callback) {
  this.userService.getUserSettings(callback);
};

SettingsController.prototype.saveUserSettings = function() {
  var params = this.settingsItem.toBody();
  var that = this;
  this.userService.saveUserSettings(params, function(err, result) {
    that.error = err;
    console.log(result);
  });
};

SettingsController.prototype.changePassword = function() {
  var params = {
    current_password: this.current_password,
    new_password: this.new_password
  }
  var that = this;
  this.userService.changePassword(params, function(err, result) {
    that.password_error = err;
  });
  this.current_password = "";
  this.new_password = "";
}

SettingsController.prototype.maxDate = function() {
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

module.exports = SettingsController;