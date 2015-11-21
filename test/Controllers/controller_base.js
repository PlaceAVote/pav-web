var expect = require('chai').expect;
var ControllerBase = require('../../src/controllers/controller_base.js');

describe('Controller Base', function() {
  it('uses auth service to log in (uses success path)', function(done){
    var authService = {
      validateToken: function(callback) {
        callback(true);
      }
    };
    var location = {
      path: function(destination) {
        expect(destination).to.eql('/feed');
        done();
      }
    }
   var subject = new ControllerBase(authService, location);
   subject.authorize({success: '/feed'});
  });
  it('uses error bath when auth fails', function(done) {
    var authService = {
      validateToken: function(callback) {
        callback(false);
      }
    };
    var location = {
      path: function(destination) {
        expect(destination).to.eql('/');
        done();
      }
    }
   var subject = new ControllerBase(authService, location);
   subject.authorize({error: '/'});
  });
});
