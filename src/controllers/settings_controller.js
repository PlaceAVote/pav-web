var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var SettingsItem = require('../models/settings_item.js');

SettingsController = function($scope, $location, userService, authService, $rootScope) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.userService = userService;
  this.rs = $rootScope;

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