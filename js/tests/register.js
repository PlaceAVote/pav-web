'use stict';

describe('Controller: LoginCtrl', function() {

	beforeEach(module('pavApp'));

	var LoginCtrl,
		scope;

		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			LoginCtrl = $controller('LoginCtrl', {
				$scope: scope
			});
		}));


		it('Should make sure the email fail if not valid', function() {
			scope.login.user.email[0] = "anthony.com";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.email[1]).toBe(false);
		});



		it('Should make sure the password fails client side validation', function() {
			scope.login.user.email[0] = "anthony@email.com";
			scope.login.user.password[0] = "password";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.password[1]).toBe(false);
		});

		it('Should fail client side validation for password and email', function() {
			scope.login.user.email[0] = "anthonyemail.com";
			scope.login.user.password[0] = "password";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.email[1]).toBe(false);
			expect(scope.login.user.password[1]).toBe(false);
		});

		it('Should allow valid email address and password to pass client side validation', function() {
			scope.login.user.email[0] = "anthony@email.com";
			scope.login.user.password[0] = "p455worD";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.email[1]).toBe(true);
			expect(scope.login.user.password[1]).toBe(true);
		});
});