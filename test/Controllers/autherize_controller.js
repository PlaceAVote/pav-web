var expect = require('chai').expect;
var AuthorizeController = require('../../src/controllers/autherize_controller.js');

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
   AuthorizeController.authorize({success: '/feed', authorizer: authService, location: location});
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
   AuthorizeController.authorize({error: '/', authorizer: authService, location: location});
  });
  it('does not go to path if the success option is not defined', function(done){
    var called = false;
    var authService = {
      validateToken: function(callback) {
        callback(true);
      }
    };
    var location = {
      path: function(destination) {
        called = true;
      }
    }
   AuthorizeController.authorize({authorizer: authService, location: location});
   expect(called).to.eql(false);
   done();
  });
  it('does not go to path if the error option is not defined', function(done){
    var called = false;
    var authService = {
      validateToken: function(callback) {
        callback(false);
      }
    };
    var location = {
      path: function(destination) {
        called = true;
      }
    }
   AuthorizeController.authorize({authorizer: authService, location: location});
   expect(called).to.eql(false);
   done();
  });
  it('produces error when no auth or location are not defined', function(){
    var fn = function(){
     AuthorizeController.authorize();
    }
    expect(fn).to.throw(Error);
  });
});
