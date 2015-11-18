var expect = require('chai').expect;
var AuthService = require('../../src/services/auth_service.js');
var mockLocal = require('../mocks/local_storage.js');

var local = new mockLocal();
var options = {
  window: {
   localStorage: local
  }
};

describe('AuthService', function(){
  it('gets auth token', function(){
    var subject = new AuthService(options);
    expect(subject.getAccessToken()).to.eql(undefined);
    subject.setAuth('TOKEN');
    expect(subject.getAccessToken()).to.eql('PAV_AUTH_TOKEN TOKEN');
  });
  it('gets facebook token', function(){
    var subject = new AuthService(options);
    expect(subject.getFacebookAccessToken()).to.eql(undefined);
    subject.setFacebookAuth({accessToken: 'TOKEN'});
    expect(subject.getFacebookAccessToken()).to.eql('TOKEN');
  });
});
describe('Stores Token in Browser', function(){
  it('puts token in local storage on set', function() {
    var expectStoredToken = {
      pav: 'PAV_AUTH_TOKEN TOKEN'
    };
    var subject = new AuthService(options);
    subject.setAuth('TOKEN');
    expect(local.storage[0]).to.eql(expectStoredToken);
  });
  it('gets local storage when auth is null', function() {
    local.storage = [];
    local.storage.push({'pav': 'PAV_AUTH_TOKEN TOKEN'});
    var subject = new AuthService(options);
    var token = subject.getAccessToken();
    expect(token).to.eql('PAV_AUTH_TOKEN TOKEN');
    local.storage = [];
  });
  it('returns undefined if theres nothing in local storage', function() {
    local.storage = [];
    var subject = new AuthService(options);
    var token = subject.getAccessToken();
    expect(token).to.eql(undefined);
    local.storage = [];
  });
});
describe('logged in status', function(){
  it('returns true if there is auth', function(){
    var subject = new AuthService(options);
    subject.setAuth('TOKEN');
    expect(subject.loggedInStatus()).to.eql(true);
  });
  it('returns false if there is no auth', function(){
    options.window.localStorage.storage = [];
    var subject = new AuthService(options);
    expect(subject.loggedInStatus()).to.eql(false);
  });
  it('returns true if there is in local storage', function(){
    options.window.localStorage.storage = [{'pav': 'TOKEN'}];
    var subject = new AuthService(options);
    expect(subject.loggedInStatus()).to.eql(true);
  });
});
describe('ValidateToken', function(){
  it('returns a false result when no token', function(done) {
    options.window.localStorage.storage = [];
    var subject = new AuthService(options);
    subject.validateToken(function(result) {
      expect(result).to.eql(false);
      done();
    });
  });
  it('calls correct endpoint', function(done) {
    options.window.localStorage.storage = [{'pav': 'PAV_AUTH_TOKEN TOKEN'}];
    function mockResource(url, params, method){
      expect(url).to.eql('http://pav-user-api-924234322.us-east-1.elb.amazonaws.com:8080/user/token/validate?token=PAV_AUTH_TOKEN TOKEN');
      expect(params).to.eql(undefined);
      expect(method.authorize.method).to.eql('GET');
      done();
    }
    mockResource.prototype.authorize = function(){};
    var subject = new AuthService(options, mockResource);
    subject.validateToken(function(result) {
      expect(result).to.eql(false);
      done();
    });
  });
  it('returns false if theres a server error', function(done) {
    options.window.localStorage.storage = [{'pav': 'PAV_AUTH_TOKEN TOKEN'}];
    function mockResource(url, params, method){
    }
    mockResource.prototype.authorize = function(params, onLoad, onError){
      onError({status: 401});
    };
    var subject = new AuthService(options, mockResource);
    subject.validateToken(function(result) {
      expect(result).to.eql(false);
      done();
    });
  });
  it('returns true when server response with 200', function(done) {
    options.window.localStorage.storage = [{'pav': 'PAV_AUTH_TOKEN TOKEN'}];
    function mockResource(url, params, method){
    }
    mockResource.prototype.authorize = function(params, onLoad, onError){
      onLoad({status: 200});
    };
    var subject = new AuthService(options, mockResource);
    subject.validateToken(function(result) {
      expect(result).to.eql(true);
      done();
    });
  });
});


