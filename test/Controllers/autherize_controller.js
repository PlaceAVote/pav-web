var expect = require('chai').expect;
var AuthorizeController = require('../../src/controllers/autherize_controller.js');

describe('Auth Base', function() {
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
  it('redirects to / if no token and tries to hit /feed', function(done) {
    var authService = {
      validateToken: function(callback) {
        callback(false);
      }
    };
    var location = {
      path: function(destination) {
        expect(destination).to.eql('/');
        done();
      },

      $$path: '/feed', 
    }
   AuthorizeController.authorize({error: '/', authorizer: authService, location: location});
  });

  it('redirects to / if no token and tries to hit /settings', function(done) {
    var authService = {
      validateToken: function(callback) {
        callback(false);
      }
    };
    var location = {
      path: function(destination) {
        expect(destination).to.eql('/');
        done();
      },

      $$path: '/settings', 
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
  describe('Logout', function(){
    it('should take in options', function(){
      var func = function() {
        AuthorizeController.logout(undefined);
      }
      expect(func).to.throw('Need options');
    });
    it('calls authorizer logout is has options', function(){
      var loggedOut = false;
      var locationCalled = false;

      var authService = {
        logout: function(callback) {
          loggedOut = true;
          callback();
        },
      };

      var locationMock = {
        path: function(root) {
          locationCalled = true;
        }
      };

      var options = {
        authorizer: authService,
        location: locationMock,
      };

      AuthorizeController.logout(options);
      expect(loggedOut).to.eql(true);
      expect(locationCalled).to.eql(true);
    });
  });
});
