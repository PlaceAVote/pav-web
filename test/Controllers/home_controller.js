var HomeCtrl = require("../../src/controllers/website/home_controller.js");
var expect = require("chai").expect;
var authService = {
  validateToken: function(callback){
    return callback(false);
  }
};

describe('HomeCtrl', function() {
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
      var subject = new HomeCtrl(scope, location, {}, userService, {}, authService);
      subject.loginWithFacebook();
      expect(called).to.eql(true);
    });
  });
});
