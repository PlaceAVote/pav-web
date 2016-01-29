var expect = require('chai').expect;
var ContactCtrl = require('../../src/controllers/website/contact_controller.js');

describe('Contact Controller', function() {
  var scope = {
    mailData: {
      name: "bob",
      email: "bob@test.com",
      body: "hi",
    },
  };
  var timeout = function() {};

  it('toMail set success true if mail service return success', function(done) {
    function mockMailService() {
      this.sendMail = function(mailData, callback) {
         return callback(undefined, []);
      }
    };

    var subject = new ContactCtrl(scope, timeout, new mockMailService());
    subject.toMail();
    expect(subject.sendMailSuccess).to.eql(true);
    expect(subject.sendMailErr).to.eql(false);
    done();
  });

  it('toMail set error true if mail service return error', function(done) {
    function mockMailService() {
      this.sendMail = function(mailData, callback) {
         return callback([]);
      }
    };

    var subject = new ContactCtrl(scope, timeout, new mockMailService());
    subject.toMail();
    expect(subject.sendMailSuccess).to.eql(false);
    expect(subject.sendMailErr).to.eql(true);
    done();
  });
});
