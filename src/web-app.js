var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
var angular = require('angular');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource')]);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl as login'
		})
		.when('/topics', {
			templateUrl: 'partials/topics-register.html',
			controller: 'TopicRegisterCtrl as topicsRegister'
		})
		.when('/user-signup', {
			templateUrl: 'partials/user-signup.html',
			controller: 'SignUpCtrl as signup'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);
app.controller('TopicRegisterCtrl',['$scope','$location', RegisterController]);
app.controller('SignUpCtrl',['$scope','$location', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', LoginController]);
