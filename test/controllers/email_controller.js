var expect = require('chai').expect;
var EmailController = require('../../src/controllers/email_controller.js');

describe('EmailController', function() {
  it('does not populat googleContacts on error from the google getContacts implementation', function() {
    var google = {
      getContacts: function(callback) {
        return callback(new Error('Google Error'));
      }
    };
    var email = new EmailController(google);
    email.fetchGmailEmails();
    expect(email.googleContacts).to.eql({});
  });

  it('populates google contacts with hash of email: name', function() {
    var google = {
      getContacts: function(callback) {
        return callback(null, [{ email: 'test@test.com', name: 'test' }]);
      }
    };
    var email = new EmailController(google);
    email.fetchGmailEmails();
    expect(email.googleContacts['test@test.com'].name).to.eql('test');
  });

  it('calling push on on a google contacts pushes the name/email to contacts list', function() {
    var google = {
      getContacts: function(callback) {
        return callback(null, [{ email: 'test@test.com', name: 'test' }]);
      }
    };
    var email = new EmailController(google);
    email.fetchGmailEmails();
    email.googleContacts['test@test.com'].push();
    expect(email.contacts.length).to.eql(1);
    expect(email.contacts[0]).to.eql({ email: 'test@test.com', name: 'test' });
  });
});
