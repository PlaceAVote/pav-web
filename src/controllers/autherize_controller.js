var PAV = window.PAV || {};
function AuthorizeController() {}
/**
 ** Autherize the current session.
 ** @constructor
 ** @param {object} options - options contians 'autherizer', 'location', 'success' and 'error'
**/
AuthorizeController.authorize = function(options) {
  options = options || {};
  options.authorizer.validateToken(function(result) {
    if (result) {
      if (options.success) {
        if (options.location.$$path === '/') {
          options.location.path(options.success);
        }
      }
    } else {
      if (options.location.$$path === '/feed' || options.location.$$path === '/settings') {
        options.location.path(options.error);
      }
    }
  });
};

AuthorizeController.logout = function(options) {
  options = options || {};
  if (!options.location || !options.authorizer) {
    throw 'Need options';
  }

  options.authorizer.logout(function(err, result) {
    options.location.path('/');
  });
};


module.exports = AuthorizeController;
PAV.autherizeController = AuthorizeController;
