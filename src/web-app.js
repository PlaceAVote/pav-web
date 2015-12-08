//controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
var FeedController = require('./controllers/feed_controller.js');
var BillController = require('./controllers/bill_controller.js');
var HeaderController = require('./controllers/header_controller.js');
var ProfileController = require('./controllers/profile_controller.js');
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
var commentsDirective = require('./directives/comments.js');
var commentDirective = require('./directives/comment.js');
var commentEventDirective = require('./directives/comment_event.js');
var bannerDirective = require('./directives/banner.js');
var timelineDirective = require('./directives/timeline.js');
var timelineFollowingEventDirective = require('./directives/following_event.js');
var timelineFollowedEventDirective = require('./directives/followed_event.js');
var voteEventDirective = require('./directives/vote_event.js');
var headerNav = require('./directives/header_directive.js');
// var statusChart = require('./directives/statuschart.js');
//thirdparty integrations
var Facebook = require('./integrations/facebook.js');
//temporary resources
var TempBillResource = require('./temp/mockBillResource.js');
var TempTrendResource = require('./temp/mockTrendResource.js');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), require('angular-sanitize'), 'pavDirectives']);


app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl as login'
		})
		.when('/onboarding', {
			templateUrl: 'partials/onboarding.html',
		})
    .when('/feed', {
      templateUrl: 'partials/feed.html',
      controller: 'FeedCtrl as feed'
    })
    .when('/bill/:id', {
      templateUrl: 'partials/bill.html',
      controller: 'BillCtrl as bill'
    })
    .when('/profile/:id', {
      templateUrl: 'partials/profile.html',
      controller: 'ProfileCtrl as profile'
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
app.factory('authService', ['$resource', AuthService]);
app.factory('userService', ['$resource', 'facebookService', 'authService', UserService]);
app.factory('billService', ['tempBillResource', '$resource', 'authService', 'userService', BillService]);
app.factory('trendService', ['tempTrendResource', TrendService]);
app.factory('commentService', ['$resource', 'userService', 'authService', CommentService]);
app.factory('legislationService', ['$resource', 'authService', LegislatorService]);
app.factory('voteService', ['$resource', 'authService', 'userService', VoteService]);

//controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$rootScope','$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', 'authService', '$rootScope', LoginController]);
app.controller('FeedCtrl', ['$rootScope','$scope', '$location', 'userService', 'billService', 'trendService', 'authService', FeedController]);
app.controller('BillCtrl', ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', BillController]);
app.controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'authService', 'userService', HeaderController]);
app.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'authService', 'userService', ProfileController]);
//directives
app.directive('headerNav', [headerNav]);
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
app.directive('comment', ['$compile', 'commentService', commentDirective]);
app.directive('commentEvent', ['$compile', 'commentService', commentEventDirective]);
app.directive('comments', [commentsDirective]);
app.directive('banner', [bannerDirective]);
app.directive('timeline', [timelineDirective]);
app.directive('following', ['$location', timelineFollowingEventDirective]);
app.directive('followed', ['$location', timelineFollowedEventDirective]);
app.directive('vote', ['$location', voteEventDirective]);
// app.directive('statusChart', [statusChart]);

