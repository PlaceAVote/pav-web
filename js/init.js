'use strict';
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
			controller: 'UserRegisterCtrl as userRegister'
		})
		.otherwise({
			redirectTo: '/'
		})
}]);




// 'user_strict';
// var app = angular.module('app', ['ngRoute', 'ngAnimate']);

// app.config(['$routeProvider', function($routeProvider) {
// 	$routeProvider
// 		.when('/', {
// 			templateUrl: 'partials/login.html',
// 			controller: 'LoginCtrl as login'
// 		})
// 		.otherwise({
// 			redirectTo: '/'
// 		});
// }]);