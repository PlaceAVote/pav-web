function BillController($scope, $routeParams, billService) {
  $scope = $scope || {};
  $scope.bill = this;
  this.billService = billService;
  this.Identify($routeParams);
  this.getBill(this.id);
}

BillController.prototype.Identify = function(routeParams) {
  this.id = routeParams.id;
};

BillController.prototype.getBill = function(id) {
  var that = this;
  this.billService.getBill(id, function(err, result) {
    if(err){
      that.error = true;
    }
    else {
      that.body = result;
      console.log(result);
    }
  });
};

module.exports = BillController;

