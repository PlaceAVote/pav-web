//CONTROLLERS

//Website Controllers
var HomeController = require('./controllers/website/home_controller.js'),
FaqController = require('./controllers/website/faq_controller.js'),
TeamController = require('./controllers/website/team_controller.js'),
PressController = require('./controllers/website/press_controller.js'),
MenuController = require('./controllers/website/menu_controller.js');

//App Controllers
var AssetsController = require('./controllers/assets_controller.js');
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
var AuthService = require('./services/auth_service.js');
var LegislatorService = require('./services/legislator_service.js');
var VoteService = require('./services/votes_service.js');
var CommentService = require('./services/comment_service.js');
var NotificationService = require('./services/notification_service.js');
//dependencies
var angular = require('angular');

//directives
var mailcheck = require('./directives/mailcheck.js');
var pavDirectives = require('./directives/directives.js');
var stickyNav = require('./directives/sticky.js');
var commentsDirective = require('./directives/comments.js');
var commentDirective = require('./directives/comment.js');
var commentEventDirective = require('./directives/comment_event.js');
var bannerDirective = require('./directives/banner.js');
var timelineDirective = require('./directives/timeline.js');
var timelineFollowingEventDirective = require('./directives/following_event.js');
var timelineFollowedEventDirective = require('./directives/followed_event.js');
var voteEventDirective = require('./directives/vote_event.js');
var headerNav = require('./directives/header_directive.js');
var notificationsDirective = require('./directives/notifications.js');
var commentReplyNotificationDirective = require('./directives/comment_reply_notification.js');
// var statusChart = require('./directives/statuschart.js');
//thirdparty integrations
var Facebook = require('./integrations/facebook.js');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), require('angular-sanitize'), 'pavDirectives']);


app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
    .when('/', {
      templateUrl: 'partials/website_partials/home.html',
      controller: 'HomeCtrl as home'
    })
    .when('/faq', {
      templateUrl: 'partials/website_partials/faq.html',
      controller: 'FaqCtrl as faq'
    })
    .when('/team', {
      templateUrl: 'partials/website_partials/team.html',
      controller: 'TeamCtrl as team'
    })
    .when('/press', {
      templateUrl: 'partials/website_partials/press.html',
      controller: 'PressCtrl as press'
    })
    .when('/contact', {
      templateUrl: 'partials/website_partials/contact.html',
      controller: 'PressCtrl as press'
    })
    .when('/terms-of-service-and-privacy-policy', {
      templateUrl: 'partials/website_partials/tos-and-privacy-policy.html',
      controller: 'PressCtrl as press'
    })
		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginCtrl as login'
		})
    .when('/signup', {
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


//services
app.factory('facebookService', [Facebook]);
app.factory('authService', ['$resource', AuthService]);
app.factory('userService', ['$resource', 'facebookService', 'authService', UserService]);
app.factory('billService', ['$resource', 'authService', 'userService', BillService]);
app.factory('commentService', ['$resource', 'userService', 'authService', CommentService]);
app.factory('legislationService', ['$resource', 'authService', LegislatorService]);
app.factory('voteService', ['$resource', 'authService', 'userService', VoteService]);
app.factory('notificationService', ['$resource', 'authService', NotificationService]);

//controllers
app.controller('AssetsCtrl',['$scope','$routeParams','$location', AssetsController]);
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$rootScope','$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', 'authService', '$rootScope', '$routeParams', LoginController]);
app.controller('FeedCtrl', ['$scope', '$location', 'userService', 'billService', 'authService', '$rootScope', FeedController]);
app.controller('BillCtrl', ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', BillController]);
app.controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'authService', 'userService', 'notificationService', HeaderController]);
app.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'authService', 'userService', ProfileController]);

//web controllers
app.controller('HomeCtrl', ['$scope', '$location','$anchorScroll', 'userService', '$rootScope', 'authService', HomeController]);
app.controller('FaqCtrl', ['$scope', '$location', FaqController]);
app.controller('TeamCtrl', ['$scope', '$location', TeamController]);
app.controller('PressCtrl', ['$scope', '$location', PressController]);
app.controller('MenuCtrl', ['$scope', '$location', '$routeParams', MenuController]);

//directives
app.directive('stickyNav', [stickyNav]);
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
app.directive('notifications', [notificationsDirective]);
app.directive('commentreply', ['$location', commentReplyNotificationDirective]);


