function BillController($scope, $routeParams, billService, legislatorService) {
  $scope = $scope || {};
  $scope.bill = this;
  this.billService = billService;
  this.legislatorService = legislatorService;
  this.Identify($routeParams);
  this.getBill(this.id);
  this.getTopComment(this.id);
}

BillController.prototype.Identify = function(routeParams) {
  this.id = routeParams.id;
};

BillController.prototype.getTopComment = function(id){
  var that = this;
  this.billService.getTopComment(id, function(err, result){
    if(err){
      that.topCommentError = true;
    }
    else {
      that.topComment = result;
    }
  });
};

BillController.prototype.getLegislator = function(legislator){
  var that = this;
  if(!legislator){
    return;
  }
  var id = legislator.thomas_id;
  this.legislatorService.getById(id, function(err, result){
    if(err){
      that.legislatorError = true;
    }
    else {
      that.legislator = result;
    }
  });
}

BillController.prototype.getBill = function(id) {
  var that = this;
  this.billService.getBill(id, function(err, result) {
    if(err){
      that.error = true;
    }
    else {
      that.body = result;
      that.getLegislator(result.billData.sponsor);
    }
  });
};

module.exports = BillController;

