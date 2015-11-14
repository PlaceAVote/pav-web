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


