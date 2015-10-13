var expect = require('chai').expect;
var AuthService = require('../../src/services/auth_service.js');

describe('AuthService', function(){
  it('gets auth token', function(){
    var subject = new AuthService();
    expect(subject.getAccessToken()).to.eql(undefined);
    subject.setAuth({accessToken: 'TOKEN'});
    expect(subject.getAccessToken()).to.eql('TOKEN');
  });
});

