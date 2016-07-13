var expect = require('chai').expect;
var EmailModal = require('../../src/directives/email_connections_modal.js');


var d = {
  google: function() {
    return;
  },
  emailService: {
    sendMessageToMany: function(params, callback) {
      return callback(undefined, true);
    }
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

  it('it should add email to scope.contacts', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    scope.sendInvite({email:'anthony@email.com', name: 'Anthony'});
    expect(scope.contacts[0].email).to.equal('anthony@email.com');
    expect(scope.contacts[0].name).to.equal('Anthony');
  });


  it('it should send invite to google contact and mark contact as invited', function() {
    var subject = new EmailModal(d.google, d.emailService, d.$timeout);
    subject.link(scope, {}, {});
    scope.googleContacts = {
      'anthony@email.com' : {
        name: 'Anthony',
        invited: false,
      },
    };
    scope.sendInvite({email:'anthony@email.com', name: 'Anthony'});
    expect(scope.googleContacts['anthony@email.com'].invited).to.equal(true);
  });

});
