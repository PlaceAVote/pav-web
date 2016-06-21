var config = require('../config/endpoints.js');

/**
 * Send Message to Many sends the same
 * message to multiple contacts.
 * Contacts must be defined and have length.
 * A user must be Authenticated.
 */
function sendMessageToMany($request, authService, params, callback) {
  if (!params.contacts || params.contacts.length === 0) {
    return callback(new Error('Invalid Params: Contacts Needed.'));
  }
  var token = authService.getAccessToken();
  if (!token) {
    return callback(new Error('Invalid Params: Auth Token Needed.'));
  }
  var url = config.email.url();
  var method = config.methods.get;
  method.headers.Authorization = token;
  var req = new $request(url, undefined, { sendMany: config.methods.get });
  var onLoad = function(response) {
    return callback(null, response);
  };
  var onError = function(response) {
    return callback(response);
  };
  req.sendMany(params, onLoad, onError);
}


/**
 * Email Service API to enable Email functionality
 * with the server.
 */
var emailService = function($request, authService) {
  return {
    sendMessageToMany: function(params, callback) {
      return sendMessageToMany($request, authService, params, callback);
    },
  };
};

module.exports = emailService;

