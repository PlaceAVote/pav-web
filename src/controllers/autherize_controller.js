function AuthorizeController(){}///
//js comments
AuthorizeController.authorize = function(options){
  var options = options || {};
  options.authorizer.validateToken(function(result){
    if(result) {
      if(options.success) {
        options.location.path(options.success);
      }
    }
    else {
      if(options.error) {
        options.location.path(options.error);
      }
    }
  });
};


module.exports = AuthorizeController;
