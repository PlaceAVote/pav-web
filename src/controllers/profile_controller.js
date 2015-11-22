var AuthorizeController = require('./autherize_controller.js');

function ProfileController($scope, $location, authService, userService) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  $scope = $scope || {};
  $scope.profile = this;
  this.location = $location;
  this.authService = authService;
  this.userService = userService;
  this.populateProfile();
}

ProfileController.prototype.populateProfile = function() {
  var that = this;
  this.userService.getUserProfile(function(err, result) {
    if (!err) {
      that.user = result;
      console.log(result);
    }
  });
};

module.exports = ProfileController;

