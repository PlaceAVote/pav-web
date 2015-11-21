function ControllerBase(authService, location){
this.authService = authService;
this.location = location;
}

///
//js comments
ControllerBase.prototype.authorize = function(options){
  var options = options || {};
  var that = this;
  this.authService.validateToken(function(result){
    if(result) {
      that.location.path(options.success);
    }
    else {
      that.location.path(options.error);
    }
  });
};


module.exports = ControllerBase;
