var expect = require("chai").expect;
var jsdom = require('mocha-jsdom');
var HomeCtrl;
var authService = {
  validateToken: function(callback){
    return callback(false);
  }
};

describe('HomeCtrl', function() {
  jsdom();
  before(function() {
    HomeCtrl = require("../../src/controllers/website/home_controller.js");
  });
  describe("Facebook login", function(){
    it("should call go with 'topics' if user is undefined", function(done){
      var location = {
        path: function(dest){
          expect(dest).to.eql('/onboarding');
          done();
        }
      };
      var scope = {}
      var userService = {
        loginWithFacebook : function(callback){
          callback({status:400, message:"User Not Found"});
        }
      };
      var subject = new HomeCtrl(scope, location, {}, userService, {}, authService);
      subject.go = function(hash){
        expect(hash).to.eql("/onboarding");
        done();
      };
      subject.loginWithFacebook();
    });

    it("should get user profile and call go with 'feed' if no errors", function(done){
      var location = {
        path: function(dest){
          expect(dest).to.eql('/feed');
          done();
        }
      };
      var scope = {};
      scope.$on = function() {};
      var called = false;
      var userService = {
        loginWithFacebook : function(callback){
          callback();
        },
        getUserProfile : function(id, callback) {
          called = true;
          callback(undefined, true);
        }
      };
      var mockRootScope = {
        inApp: false,
        notLoggedIn: true,
      };

      var subject = new HomeCtrl(scope, location, {}, userService, mockRootScope, authService);
      subject.loginWithFacebook();
      expect(called).to.eql(true);
      expect(subject.rs.inApp).to.equal(true);
      expect(subject.rs.notLoggedIn).to.equal(false);
    });
  });
});
