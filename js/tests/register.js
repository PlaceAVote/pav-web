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
			scope.login.user.email = "anthony.com";
			console.log(scope.login.user.email);
			scope.login.validate(scope.login.user);
			expect(scope.login.user.email).toBe(false);
			console.log(scope.login.user.email);
		});



		it('Should make sure the password fails client side validation', function() {
			scope.login.user.email = "anthony@email.com";
			scope.login.user.password = "password";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.password).toBe(false);
		});

		it('Should allow valid email address and password to pass client side validation', function() {
			scope.login.user.email = "anthony@email.com";
			scope.login.user.password = "p455worD";
			scope.login.validate(scope.login.user);
			expect(scope.login.user.email).toBe('anthony@email.com');
			expect(scope.login.user.password).toBe('p455worD');
		});
});