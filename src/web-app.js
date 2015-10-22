//controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
var FeedController = require('./controllers/feed_controller.js');
var BillController = require('./controllers/bill_controller.js');

//services
var UserService = require('./services/user_service.js');
var BillService = require('./services/bill_service.js');
var TrendService = require('./services/trend_service.js');
var AuthService = require('./services/auth_service.js');
var LegislatorService = require('./services/legislator_service.js');
var VoteService = require('./services/votes_service.js');
var CommentService = require('./services/comment_service.js');

//dependencies
var angular = require('angular');

//directives
var mailcheck = require('./directives/mailcheck.js');
var pavDirectives = require('./directives/directives.js');


//thirdparty integrations
var Facebook = require('./integrations/facebook.js');
//temporary resources
var TempBillResource = require('./temp/mockBillResource.js');
var TempTrendResource = require('./temp/mockTrendResource.js');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), 'pavDirectives']);


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
    .when('/feed', {
      templateUrl: 'partials/feed.html',
      controller: 'FeedCtrl as feed'
    })
    .when('/bill/:id', {
      templateUrl: 'partials/bill.html',
      controller: 'BillCtrl as bill'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

//temporary resources
app.factory('tempBillResource', [TempBillResource]);
app.factory('tempTrendResource', [TempTrendResource]);

//services
app.factory('facebookService', [Facebook]);
app.factory('authService', [AuthService]);
app.factory('userService', ['$resource', 'facebookService', 'authService', UserService]);
app.factory('billService', ['tempBillResource', '$resource', 'authService', 'userService', BillService]);
app.factory('trendService', ['tempTrendResource', TrendService]);
app.factory('commentService', ['$resource', 'userService', 'authService', CommentService]);
app.factory('legislationService', ['$resource', 'authService', LegislatorService]);
app.factory('voteService', ['$resource', 'authService', 'userService', VoteService]);

//controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', LoginController]);
app.controller('FeedCtrl', ['$scope', '$location', 'userService', 'billService', 'trendService', FeedController]);
app.controller('BillCtrl', ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', BillController]);
//directives
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
