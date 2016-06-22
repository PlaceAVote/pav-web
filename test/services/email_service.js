var expect = require('chai').expect;
var emailService = require('../../src/services/email_service.js');

describe('Email Service', function() {
  var mockAuthService = {
    getAccessToken: function() {
      return 'PAV PAV_AUTH_TOKEN';
    },
  };
  describe('Send Message To Many', function() {
    it('wont send when contacts is not defined', function(done) {
      var subject = emailService();
      var params = {
        message: '',
      };
      subject.sendMessageToMany(params, function(e) {
        expect(e.message).to.eql('Invalid Params: Contacts Needed.');
        done();
      });
    });
    it('wont send when contacts is empty', function(done) {
      var subject = emailService();
      var params = {
        contacts: [],
        message: '',
      };
      subject.sendMessageToMany(params, function(e) {
        expect(e.message).to.eql('Invalid Params: Contacts Needed.');
        done();
      });
    });

    it('wont send when auth service returns no auth token', function(done) {
      var mockAuthService = {
        getAccessToken: function() {},
      };
      var subject = emailService(undefined, mockAuthService);
      var params = {
        contacts: [{
          email: 'test',
          name: 'tester',
        }],
        message: '',
      };
      subject.sendMessageToMany(params, function(e) {
        expect(e.message).to.eql('Invalid Params: Auth Token Needed.');
        done();
      });
    });
    it('calls resource with correct params', function(done) {
      var actualParams, actualUrl, actualMethod, actualBody;
      var mockRequest = function(url, params, method) {
        actualUrl = url;
        actualParams = params;
        actualMethod = method;
        return {
          sendMany: function(body, onLoad) {
            actualBody = body;
            onLoad();
          },
        };
      };
      var subject = emailService(mockRequest, mockAuthService);
      var params = {
        contacts: [{
          email: 'test',
          name: 'tester',
        }],
        message: '',
      };
      subject.sendMessageToMany(params, function(e) {
        expect(e).to.eql(null);
        expect(actualUrl).to.contain('invite');
        expect(actualParams).to.eql(undefined);
        expect(actualMethod.sendMany.method).to.eql('POST');
        expect(actualMethod.sendMany.headers.Authorization).to.eql('PAV PAV_AUTH_TOKEN');
        done();
      });
    });
  });
});
