var expect = require('chai').expect;
var passwordService = require('../../src/services/password_service.js');



var mockResponse = {status: '200'};

var mockError = {status: '401'};

var email = 'user@gmail.com';

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

describe('Password Reset Service', function() {

	

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
