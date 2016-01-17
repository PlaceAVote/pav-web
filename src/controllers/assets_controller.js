AssetsController = function($scope, $routeParams, $location) {
  $scope = $scope || {};
  $scope.assets = this;
  this.location = $location;
};

module.exports = AssetsController;
