var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var SettingsItem = require('../models/settings_item.js');

SettingsController = function($scope, $location, userService, authService, $rootScope) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.userService = userService;
  this.rs = $rootScope;

  this.getUserSettings(function(err, result) {
    if (!err) {
      console.log(result);
      this.settingsItem = SettingsItem.createFromJson(result);
    }
  });

  this.ss = "asdf";
}

SettingsController.prototype.getUserSettings = function(callback) {
  this.userService.getUserSettings(callback);
};

module.exports = SettingsController;