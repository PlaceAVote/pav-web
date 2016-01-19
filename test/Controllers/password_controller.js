var expect = require('chai').expect;
var PasswordController = require('../../src/controllers/password_controller.js');
// PasswordController($scope, $location, $routeParams, passwordService)
var scope = {};
var location = {
  path: function(url) {
    return url;
  },
};

var mockAuthService = {
  validateToken: function(callback) {
    return callback(true);
  }
}

var params = {token: 'token'};

describe('Password Controller', function() {
  it('Should pass token to service and return a status 200', function() {
    var mockService = {
      newPassword: function(user, callback) {
        return callback(undefined, {status: '200'});
      }
    };
    var subject = new PasswordController(scope, location, params, mockService, mockAuthService);
    subject.user = {
      reset_token: 'token',
      new_password: 'newPassword',
    };
    subject.newPasswordConfirm = 'newPassword',
    subject.newPassword();
    expect(subject.confirmed).to.equal(true);
  });
  it('Should fail token to service and return a status 401', function() {
    var mockService = {
      newPassword: function(token, callback) {
        return callback({status: '401'});
      }
    };
    var subject = new PasswordController(scope, location, params, mockService, mockAuthService);
    subject.user = {
      reset_token: 'token',
      new_password: 'newPassword',
    };
    subject.newPasswordConfirm = 'newPassword',
    subject.newPassword();
    expect(subject.confirmed).to.equal(false);
  });
  it('Should return error if password is not present or less than six characters', function() {
    var mockService = {};
    var subject = new PasswordController(scope, location, params, mockService, mockAuthService);
    subject.user = {
      reset_token: 'token',
      new_password: 'newPa',
    };
    subject.newPassword();
    expect(subject.noPassword).to.equal(true);
  });
  it('If password does not match confirm password property', function() {
    var mockService = {};
    var subject = new PasswordController(scope, location, params, mockService, mockAuthService);
    subject.user = {
      reset_token: 'token',
      new_password: 'newPassword',
    };
    subject.newPasswordConfirm = 'newPasswood',
    subject.newPassword();
    expect(subject.noMatch).to.equal(true);
  });
})
