var expect = require('chai').expect;
var passwordService = require('../../src/services/password_service.js');



var mockResponse = {status: '200'};

var mockError = {status: '401'};

var email = 'user@gmail.com';

var reset = {
    reset_token: 'token', 
    new_password: 'newpassword',
  };


describe('Password Reset Service', function() {
  var mockResource = function() {
    this.post = function(onLoad, onError) {
      onLoad(mockResponse);
    }
  }

  var mockErrorResource = function() {
    this.post = function(onLoad, onError) {
      onError(mockError);
    }
  }

	it('Should return a status 200 object', function() {
		var subject = new passwordService(mockResource);
		subject.passwordReset(email, function(err, res) {
			expect(err).to.equal(undefined);
			expect(res).to.equal(mockResponse);
		});
	});

	it('Should return an status 401 object', function() {
		var subject = new passwordService(mockErrorResource);
		subject.passwordReset(email, function(err, res) {
			expect(err).to.equal(mockError);
		});		
	});

});

describe('Password Reset Confirm Token', function() {
  var mockResource = function() {
    this.post = function(params, onLoad, onError) {
      onLoad(mockResponse);
    }
  }

  var mockErrorResource = function() {
    this.post = function(params, onLoad, onError) {
      onError(mockError);
    }
  }
  it('Should return a status 200 object', function() {
    var subject = new passwordService(mockResource);
    subject.newPassword(reset, function(err, res) {
      expect(err).to.equal(undefined);
      expect(res).to.equal(mockResponse);      
    });
  });
  it('Should return an status 401 object', function() {
    var subject = new passwordService(mockErrorResource);
    subject.newPassword(reset, function(err, res) {
      expect(err).to.equal(mockError);
    });   
  });
})
