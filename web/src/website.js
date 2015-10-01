
//controllers
HomeCtrl = require('./js/controllers/home.js');
FaqCtrl = require('./js/controllers/faq.js');
TeamCtrl = require('./js/controllers/team.js');
PressCtrl = require('./js/controllers/press.js');
MenuCtrl = require('./js/controllers/menu.js');
//dependencies
var angular = require('angular');

//directives
var directives = require('./js/directives/sticky.js');

var app = angular.module('webPav', [require('angular-route'), require('angular-animate'), require('angular-resource'), 'pavDirectives']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl as home'
		})
		.when('/faq', {
			templateUrl: 'partials/faq.html',
			controller: 'FaqCtrl as faq'
		})
		.when('/team', {
			templateUrl: 'partials/team.html',
			controller: 'TeamCtrl as team'
		})
		.when('/press', {
			templateUrl: 'partials/press.html',
			controller: 'PressCtrl as press'
		})
		.when('/contact', {
			templateUrl: 'partials/contact.html',
			controller: 'PressCtrl as press'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);


app.controller('HomeCtrl', ['$scope', '$location','$anchorScroll', HomeCtrl]);
app.controller('FaqCtrl', ['$scope', '$location', FaqCtrl]);
app.controller('TeamCtrl', ['$scope', '$location', TeamCtrl]);
app.controller('PressCtrl', ['$scope', '$location', PressCtrl]);
app.controller('MenuCtrl', ['$scope', '$location', MenuCtrl]);

