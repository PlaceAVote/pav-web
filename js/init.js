var RegisterController = require('./Controllers/registerController.js');
var app = angular.module('pavApp', ['ngRoute','ngAnimate']);

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
