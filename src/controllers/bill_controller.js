function BillController($scope, $routeParams) {
  $scope = $scope || {};
  $scope.bill = this;
  this.Identify($routeParams);
}

BillController.prototype.Identify = function(routeParams) {
  this.id = routeParams.id;
};

module.exports = BillController;

