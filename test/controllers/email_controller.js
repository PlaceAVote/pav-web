var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');
var EmailController;

describe('EmailController', function() {
  jsdom();
  before(function() {
    EmailController = require('../../src/controllers/email_controller.js');
  });
  describe('fetchGmailEmails', function() {
    it('does not populat googleContacts on error from the google getContacts implementation', function() {
      var google = {
        getContacts: function(callback) {
          return callback(new Error('Google Error'));
        },
      };
      var email = new EmailController(google);
      email.fetchGmailEmails();
      expect(email.googleContacts).to.eql({});
    });

    it('populates google contacts with hash of email: name', function() {
      var google = {
        getContacts: function(callback) {
          return callback(null, [{ email: 'test@test.com', name: 'test' }]);
        },
      };
      var email = new EmailController(google);
      email.fetchGmailEmails();
      expect(email.googleContacts['test@test.com'].name).to.eql('test');
    });

    it('calling push on on a google contacts pushes the name/email to contacts list', function() {
      var google = {
        getContacts: function(callback) {
          return callback(null, [{ email: 'test@test.com', name: 'test' }]);
        },
      };
      var email = new EmailController(google);
      email.fetchGmailEmails();
      email.googleContacts['test@test.com'].push();
      expect(email.contacts.length).to.eql(1);
      expect(email.contacts[0]).to.eql({ email: 'test@test.com', name: 'test' });
    });
  });
  describe('sendMessages', function() {
    it('should include a message when one is defined', function() {
      var actualParams;
      var mockEmailService = {
        sendMessageToMany: function(params, callback) {
          actualParams = params;
          callback();
        },
      };
      var email = new EmailController({}, mockEmailService);
      email.contacts = [
        {
          email: 'hello@world.com',
          name: 'hello',
        },
      ];
      email.message= 'check this site!';
      email.sendMessages();
      expect(actualParams).to.eql({ message: 'check this site!', contacts: [ { email: 'hello@world.com', name: 'hello' } ] });
    });

    it('wont include message when one is not defined', function() {
      var actualParams;
      var mockEmailService = {
        sendMessageToMany: function(params, callback) {
          actualParams = params;
          callback();
        },
      };
      var email = new EmailController({}, mockEmailService);
      email.contacts = [
        {
          email: 'hello@world.com',
          name: 'hello',
        },
      ];
      email.sendMessages();
      expect(actualParams).to.eql({ contacts: [ { email: 'hello@world.com', name: 'hello' } ] });
    });
  });
});
