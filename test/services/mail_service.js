var expect = require('chai').expect;
var MailService = require('../../src/services/mail_service.js');
var config = require('../../src/config/endpoints.js');


describe('Mail Service', function() {
  describe('Send Mail', function() {
    var mockMailData = {
      body: "hi",
      email: "bob@test.com",
      name: "bob",
    };

    it('returns an error if no mail data is given', function(done) {
      var subject = new MailService({});
      subject.sendMail(undefined, function(err) {
        expect(err).to.eql('Mail data should be given');
        done();
      });
    });

    it('calls params with correct config', function(done) {
      function mockResource(url, params, method, options) {
        this.send = function(){};
        expect(url).to.eql('https://mandrillapp.com/api/1.0//messages/send.json');
        expect(params).to.eql(undefined);
        expect(method.send.isArray).to.eql(true);
        expect(method.send.method).to.eql('POST');
        done();
      }
      var subject = new MailService(mockResource);
      subject.sendMail(mockMailData, function(err) {
        expect(err).to.eql(undefined);
      });
    });

    it('send correct data to server and returns an error from the server', function(done) {
      function mockResource(url, params, method) {
        this.send = function(body, onLoad, onError) {
          expect(body.key).to.eql(config.mandrillKey);
          expect(body.message.from_email).to.eql(mockMailData.email);
          expect(body.message.from_name).to.eql(mockMailData.name);
          expect(body.message.text).to.eql(mockMailData.body);
          expect(body.message.to[0].email).to.eql("hello@placeavote.com");
          expect(body.message.to[0].type).to.eql("to");
          onError('Error');
        };
      }
      var subject = new MailService(mockResource);
      subject.sendMail(mockMailData,function(err) {
        expect(err).to.eql('Error');
        done();
      });
    });

    it('returns an error array if server response status is not "sent"', function(done) {
      function mockResource(url, params, method) {
        this.send = function(body, onLoad, onError) {
          var result = [
            {
              status: 'rejected',
            },
          ];
          return onLoad(result);
        };

      }
      var subject = new MailService(mockResource);
      subject.sendMail(mockMailData, function(err, result) {
        expect(err[0].status).to.eql('rejected');
        done();
      });
    });

    it('returns an array if server response status is "sent"', function(done) {
      function mockResource(url, params, method) {
        this.send = function(body, onLoad, onError) {
          var result = [
            {
              status: 'sent',
            },
          ];
          return onLoad(result);
        };

      }
      var subject = new MailService(mockResource);
      subject.sendMail(mockMailData, function(err, result) {
        expect(err).to.eql(undefined);
        expect(result.length).to.eql(1);
        done();
      });
    });
  });
});
