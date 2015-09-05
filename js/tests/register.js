'use stict';

describe('Controller: LoginCtrl', function() {

	beforeEach(module('pavApp'));

	var LoginCtrl,
		scope,
		login;

		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			LoginCtrl = $controller('LoginCtrl', {
				$scope: scope
			});
			login = LoginCtrl;
		}));


		it('Should make sure the email fail if not valid', function() {
			login.user.email = "anthony.com";
			login.validate(login.user);
			expect(login.user.emailValid).toBe(false);
		});



		it('Should make sure the password fails client side validation', function() {
			login.user.email = "anthony@email.com";
			login.user.password = "password";
			login.validate(login.user);
			expect(login.user.passwordValid).toBe(false);
		});

		it('Should fail client side validation for password and email', function() {
			login.user.email = "anthonyemail.com";
			login.user.password = "password";
			login.validate(login.user);
			expect(login.user.emailValid).toBe(false);
			expect(login.user.passwordValid).toBe(false);
		});

		it('Should allow valid email address and password to pass client side validation', function() {
			login.user.email = "anthony@email.com";
			login.user.password = "p455worD";
			login.validate(login.user);
			expect(login.user.emailValid).toBe(true);
			expect(login.user.passwordValid).toBe(true);
		});
});