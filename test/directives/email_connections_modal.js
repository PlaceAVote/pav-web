var expect = require('chai').expect;
var EmailModal = require('../../src/directives/email_connections_modal.js');


var d = {
  google: function() {
    return;
  },
  emailService: function() {
    return;
  },
  $timeout: function() {
    return;
  }
};

var scope = {};

describe('Email Connections Modal', function() {
  it('should set gmail view to true', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    scope.view('gmail');
    expect(scope.views.gmail).to.equal(true);
  });

  it('should set manual view to true and gmail to false', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    scope.view('manual');
    expect(scope.views.gmail).to.equal(false);
    expect(scope.views.manual).to.equal(true);
  });

  it('should add email to contacts list', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    var contacts = [{email:'anthony@email.com', name:'anthony'}]
    scope.addUserContact(contacts[0]);
    expect(scope.contacts[0].name).to.equal('anthony');
    expect(scope.contacts[0].email).to.equal('anthony@email.com');
    expect(scope.contacts[0].added).to.equal(true);
  });

  it('should remove email from contacts list if email exists in contact list', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    var contacts = [{email:'anthony@email.com', name:'anthony'}]
    scope.contacts = contacts;
    scope.addUserContact(contacts[0]);
    expect(scope.contacts).to.be.empty;
  });

});
