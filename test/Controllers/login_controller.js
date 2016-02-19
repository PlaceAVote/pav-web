var LoginCtrl = require("../../src/controllers/login_controller.js");
var expect = require("chai").expect;
var doc = { body: { addEventListener: function(){}}};
var authService = {
  validateToken: function(callback){
    return callback(false);
  }
};
describe('LoginCtrl', function() {

		it('Should make sure the email fail if not valid', function() {
			var scope = {};
			scope.$on = function() {};
      var subject = new LoginCtrl(scope, {}, {}, authService, {}, {}, {}, doc);
			subject.user.email = "anthony.com";
			expect(subject.emailValidation(subject.user.email)).to.be.false;
		});

		it('Should return true if valid', function() {
			var scope = {};
			scope.$on = function() {};
      var subject = new LoginCtrl(scope, {}, {}, authService, {}, {}, {}, doc);
      subject.user.email = "anthony.test1@test.com";
			expect(subject.emailValidation(subject.user.email)).to.be.true;
		});


		// it('Should make sure the password fails client side validation', function() {
		// 	var scope = {};
		// 	var subject = new LoginCtrl(scope, {}, {}, authService);
		// 	expect(subject.passwordValidation("password")).to.be.false;
		// });

		// it('Should return true is password is valid', function() {
		// 	var scope = {};
		// 	var subject = new LoginCtrl(scope, {}, {}, authService);
		// 	expect(subject.passwordValidation("p455worD")).to.be.true;
		// });


		// it('Should not call location when neither password and email are valid', function() {
		// 	var changed = false;
		// 	var created = false;
		// 	var scope = {};
		// 	var subject = new LoginCtrl(scope, {}, {}, authService);
		// 	var user = {
		// 		email : "anthonyemail.com",
		// 		password : "password"
		// 	}
		// 	subject.userService = {
		// 		createUser : function(){
		// 			created = true;
		// 		}
		// 	};
		// 	subject.location = {
		// 		path : function() {
		// 			changed = true;
		// 		}
		// 	}
		// 	subject.validate(user);
		// 	expect(changed).to.be.false;
		// 	expect(created).to.be.false;
		// 	expect(subject.user.emailValid).to.be.false;
		// 	expect(subject.user.passwordValid).to.be.false;

		// });

		// it('Should allow valid email address and password to pass client side validation', function() {
		// 	var created = false;
		// 	var changed = false;
		// 	var scope = {};
		// 	var subject = new LoginCtrl(scope, {}, {}, authService);
		// 	var user = {
		// 		email : "testing.test1@test.com",
		// 		password : "p34swOrD1"
		// 	}
		// 	subject.userService = {
		// 		createUser : function(){
		// 			created = true;
		// 		}
		// 	};
		// 	subject.location = {
		// 		path : function() {
		// 			changed = true;
		// 		}
		// 	}
		// 	subject.validate(user);
		// 	expect(subject.user.emailValid).to.be.true;
		// 	expect(subject.user.passwordValid).to.be.true;
		// 	expect(changed).to.be.true;
		// 	expect(created).to.be.true;
		// });
        describe("Facebook login", function(){
            it("should call go with 'topics' if user is undefined", function(done){
              var location = {
                path: function(dest){
                  expect(dest).to.eql('/onboarding');
                  done();
                }
              };
              var scope = {}
              scope.$on = function() {};
              var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, doc);
              subject.userService = {
                loginWithFacebook : function(callback){
                  callback({status:400, message:"User Not Found"});
                }
              };
              subject.go = function(hash){
                expect(hash).to.eql("/onboarding");
                done();
              };
              subject.loginWithFacebook();
            });
            it("should go home if user has no facebook authentication", function(done){
              var location = {
                path: function(dest){
                  expect(dest).to.eql('/');
                  done();
                }
              };
              var scope = {}
              scope.$on = function() {};
              var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, doc);
              subject.userService = {
                loginWithFacebook : function(callback){
                  callback({status:999, message:"User Not Found"});
                }
              };
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
              var subject = new LoginCtrl(scope, location, {}, authService, {}, {}, {}, doc);
              subject.userService = {
                loginWithFacebook : function(callback){
                  callback();
                },
                getUserProfile : function(id, callback) {
                  called = true;
                  callback(undefined, true);
                }
              };
              subject.loginWithFacebook();
              expect(called).to.eql(true);
            });
        });
       describe("failed login", function() {
        it("sets loginInvalid to false", function(done){
        	var scope = {};
        	scope.$on = function() {};
          var subject = new LoginCtrl(scope, {}, {}, authService, {}, {}, {}, doc);
            subject.userService = {
                login : function(params, callback){
                    callback({status:401});
                }
            };
            var test = function(callback){
                subject.login({email: 'paul@test.com', password: 'tesTING123'}, 'destination');
                callback();
            }
            test(function(){
                expect(subject.loginInvalid).to.eql(true);
                done();
             });
        });
       });
       describe("Forgot password", function() {
        it("Should return status 200 when password reset is successful", function() {
          var scope = {};
          scope.$on = function() {};
          var subject = new LoginCtrl(scope, {}, {}, authService, {}, {}, {}, doc);
          subject.passwordService = {
            passwordReset : function(params, callback) {
              callback(undefined, {status: '200'});
            }
          }
          subject.passwordReset('user@email.com', function(err, res) {
            expect(res).to.equal({status: '200'});
            expect(subject.resetFailed).to.equal(false);
            expect(subject.resetSuccess).to.equal(true);
          });
        });
        it("Should return status 401 when password reset has failed", function() {
          var scope = {};
          scope.$on = function() {};
          var subject = new LoginCtrl(scope, {}, {}, authService, {}, {}, {}, doc);
          subject.passwordService = {
            passwordReset : function(params, callback) {
              callback({status: '401'});
            }
          }
          subject.passwordReset('user@email.com', function(err) {
            expect(err).to.equal({status: '401'});
            expect(subject.resetFailed).to.equal(true);
            expect(subject.resetSuccess).to.equal(false);
          });
        });
       });

});
