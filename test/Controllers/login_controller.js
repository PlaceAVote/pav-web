var LoginCtrl = require("../../src/controllers/login_controller.js");
var expect = require("chai").expect;
describe('LoginCtrl', function() {

		it('Should make sure the email fail if not valid', function() {
			var scope = {};
			var subject = new LoginCtrl(scope);
			subject.user.email = "anthony.com";
			expect(subject.emailValidation(subject.user.email)).to.be.false;
		});
	
		it('Should return true if valid', function() {
			var scope = {};
			var subject = new LoginCtrl(scope);
			subject.user.email = "anthony.test1@test.com";
			expect(subject.emailValidation(subject.user.email)).to.be.true;
		});


		it('Should make sure the password fails client side validation', function() {
			var scope = {};
			var subject = new LoginCtrl(scope);
			expect(subject.passwordValidation("password")).to.be.false;
		});

		it('Should return true is password is valid', function() {
			var scope = {};
			var subject = new LoginCtrl(scope);
			expect(subject.passwordValidation("p455worD")).to.be.true;
		});


		it('Should not call location when neither password and email are valid', function() {
			var changed = false;
			var created = false;
			var scope = {};
			var subject = new LoginCtrl(scope);
			var user = {
				email : "anthonyemail.com",
				password : "password"
			}
			subject.userService = {
				createUser : function(){
					created = true;
				}
			};			
			subject.location = {
				path : function() {
					changed = true;
				}
			}
			subject.validate(user);
			expect(changed).to.be.false;
			expect(created).to.be.false;
			expect(subject.user.emailValid).to.be.false;
			expect(subject.user.passwordValid).to.be.false;

		});

		it('Should allow valid email address and password to pass client side validation', function() {
			var created = false;
			var changed = false;
			var scope = {};
			var subject = new LoginCtrl(scope);
			var user = {
				email : "testing.test1@test.com",
				password : "p34swOrD1"
			}
			subject.userService = {
				createUser : function(){
					created = true;
				}
			};	
			subject.location = {
				path : function() {
					changed = true;
				}
			}
			subject.validate(user);
			expect(subject.user.emailValid).to.be.true;
			expect(subject.user.passwordValid).to.be.true;
			expect(changed).to.be.true;
			expect(created).to.be.true;
		});
});
