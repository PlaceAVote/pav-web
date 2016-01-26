var expect = require('chai').expect;
var ContactCtrl = require('../../src/controllers/website/contact_controller.js');

describe('Contact Controller', function() {
  it('toMail should return without body if mail body is not defined', function(done) {
    var scope = {};
    var window = {
      location: {
        href: "",
      }
    };
    var subject = new ContactCtrl(scope, window);
    subject.toMail();
    expect(window.location.href).to.eql("mailto:hello@placeavote.com");
    done();
  });

  it('toMail should return with correct body if mail body is defined', function(done) {
    var scope = {};
    var window = {
      location: {
        href: "",
      }
    };
    var subject = new ContactCtrl(scope, window);
    subject.mailBody = "This is a mail body";
    subject.toMail();
    expect(window.location.href).to.eql("mailto:hello@placeavote.com?body=This%20is%20a%20mail%20body");
    done();
  });
  
});