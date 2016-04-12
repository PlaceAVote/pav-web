var Interest = require('./../models/interest.js');

function RegisterController($scope, $location, userService, $rootScope) {
  $scope = $scope || {};
  $scope.register = this;
  $rootScope.inApp = false;
  this.userService = userService;
  this.location = $location;
  this.interests = [
    new Interest('Crime',          'icon-crime'),
    new Interest('Healthcare',     'icon-healthcare'),
    new Interest('Taxes',          'icon-taxes'),
    new Interest('Immigration',    'icon-immigration'),
    new Interest('Education',      'icon-education'),
    new Interest('Drugs',          'icon-smoking-area'),
    new Interest('Defense',        'icon-tank'),
    new Interest('Politics',       'icon-building'),
    new Interest('Gun Rights',     'icon-gun'),
    new Interest('Technology',     'icon-ipad'),
    new Interest('Economics',      'icon-money'),
    new Interest('Social Interest','icon-police'),
  ];
  this.progressComplete = false;
  var user = this.userService.getUser();
  if (!user) {
    this.location.path('/');
  }
}

RegisterController.prototype.topicsSubmit = function() {
  this.userService.addTopics(this.getSelected());
  this.location.path('/register');
};

RegisterController.prototype.go = function(hash) {
  this.userService.addTopics(this.getSelected());
  this.location.path(hash);
};

RegisterController.prototype.select = function(name) {
  var interest = this.getInterest(name);
  if (interest) {
    interest.select();
  }

};

RegisterController.prototype.getSelected = function() {
  var interests = [];
  var len = this.interests.length;
  for (var i = len - 1; i >= 0; i--) {
    if (this.interests[i].selected) {
      interests.push(this.interests[i]);
    }
  }
  return interests;
};

RegisterController.prototype.getInterest = function(name) {
  var len = this.interests.length;
  for (var i = len - 1; i >= 0; i --) {
    if (this.interests[i].name === name) {
      return this.interests[i];
    }
  }
};


module.exports = RegisterController;
