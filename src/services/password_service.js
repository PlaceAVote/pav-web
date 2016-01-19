var config = require('../config/endpoints.js');

function PasswordService($resource) {

  var passwordReset = function(email, callback) {
    var onLoad = function(res) {
      return callback(undefined, res);
    };

    var onError = function(err) {
      return callback(err);
    };

    var url = config.password.reset(email);
    reset = new $resource(url, undefined, {post: config.methods.post});
    reset.post(onLoad, onError);
  };

  var newPassword = function(user, callback) {
    var onLoad = function(res) {
      return callback(undefined, res);
    };

    var onError = function(err) {
      return callback(err);
    };

    var url = config.password.newPassword;
    reset = new $resource(url, undefined, {post: config.methods.post});
    reset.post(user, onLoad, onError);
  };

  return {
    passwordReset: passwordReset,
    newPassword: newPassword,
  };
}

module.exports = PasswordService;
