var expect = require('chai').expect;
var AuthService = require('../../src/services/auth_service.js');

describe('AuthService', function(){
  it('gets auth token', function(){
    var subject = new AuthService();
    expect(subject.getAccessToken()).to.eql(undefined);
    subject.setAuth('TOKEN');
    expect(subject.getAccessToken()).to.eql('TOKEN');
  });
  it('gets facebook token', function(){
    var subject = new AuthService();
    expect(subject.getFacebookAccessToken()).to.eql(undefined);
    subject.setFacebookAuth({accessToken: 'TOKEN'});
    expect(subject.getFacebookAccessToken()).to.eql('TOKEN');
  });
});

