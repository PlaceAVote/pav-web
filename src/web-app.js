
// Website Controllers
var HomeController = require('./controllers/website/home_controller.js');
var FaqController = require('./controllers/website/faq_controller.js');
var TeamController = require('./controllers/website/team_controller.js');
var PressController = require('./controllers/website/press_controller.js');
var MenuController = require('./controllers/website/menu_controller.js');

// App Controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
var FeedController = require('./controllers/feed_controller.js');
var BillController = require('./controllers/bill_controller.js');
var HeaderController = require('./controllers/header_controller.js');
var ProfileController = require('./controllers/profile_controller.js');
var SettingsController = require('./controllers/settings_controller.js');
var PasswordController = require('./controllers/password_controller.js');

// Services
var UserService = require('./services/user_service.js');
var BillService = require('./services/bill_service.js');
var AuthService = require('./services/auth_service.js');
var LegislatorService = require('./services/legislator_service.js');
var VoteService = require('./services/votes_service.js');
var CommentService = require('./services/comment_service.js');
var NotificationService = require('./services/notification_service.js');
var SearchService = require('./services/search_service.js');
var PasswordService = require('./services/password_service.js');

// Dependencies
var angular = require('angular');

// Directives
var search = require('./directives/search.js');
var mailcheck = require('./directives/mailcheck.js');
var pavDirectives = require('./directives/directives.js');
var websiteNav = require('./directives/website_nav.js');
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
var trendsDirective = require('./directives/trends.js');
var autoResizeDirective = require('./directives/autoresize.js');
var termsAndConditionsDirective = require('./directives/terms_and_conditions.js');

// Thirdparty integrations
var Facebook = require('./integrations/facebook.js');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), require('angular-sanitize'), 'pavDirectives']);


app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/website_partials/home.html',
  })
  .when('/faq', {
    templateUrl: 'partials/website_partials/faq.html',
  })
  .when('/team', {
    templateUrl: 'partials/website_partials/team.html',
  })
  .when('/press', {
    templateUrl: 'partials/website_partials/press.html',
  })
  .when('/contact', {
    templateUrl: 'partials/website_partials/contact.html',
  })
  .when('/terms-of-service-and-privacy-policy', {
    templateUrl: 'partials/website_partials/tos-and-privacy-policy.html',
  })
	.when('/login', {
  templateUrl: 'partials/login.html',
  controller: 'LoginCtrl as login',
	})
  .when('/signup', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl as login',
  })
	.when('/onboarding', {
  templateUrl: 'partials/onboarding.html',
	})
  .when('/feed', {
    templateUrl: 'partials/feed.html',
    controller: 'FeedCtrl as feed',
  })
  .when('/bill/:id', {
    templateUrl: 'partials/bill.html',
    controller: 'BillCtrl as bill',
  })
  .when('/bill/:id/comment/:commentid', {
    templateUrl: 'partials/bill.html',
    controller: 'BillCtrl as bill',
  })
  .when('/profile/:id', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileCtrl as profile',
  })
  .when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsCtrl as settings',
  })
  .when('/password/reset/:token', {
    templateUrl: 'partials/password_reset.html',
    controller: 'PasswordResetCtrl as password',
  })
  .otherwise({
    redirectTo: '/',
  });
},]);


// Services
app.factory('facebookService', [Facebook]);
app.factory('authService', ['$resource', AuthService]);
app.factory('userService', ['$resource', 'facebookService', 'authService', UserService]);
app.factory('billService', ['$resource', 'authService', 'userService', BillService]);
app.factory('commentService', ['$resource', 'userService', 'authService', CommentService]);
app.factory('legislationService', ['$resource', 'authService', LegislatorService]);
app.factory('voteService', ['$resource', 'authService', 'userService', VoteService]);
app.factory('notificationService', ['$resource', 'authService', NotificationService]);
app.factory('searchService', ['$resource', 'authService', SearchService]);
app.factory('passwordService', ['$resource', PasswordService]);

// Controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$rootScope','$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', 'authService', '$rootScope', '$routeParams', 'passwordService', LoginController]);
app.controller('FeedCtrl', ['$scope', '$location', 'userService', 'billService', 'authService', '$rootScope', FeedController]);
app.controller('BillCtrl', ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', BillController]);
app.controller('HeaderCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'authService', 'userService', 'notificationService', 'searchService', '$window', HeaderController]);
app.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'authService', 'userService', ProfileController]);
app.controller('SettingsCtrl', ['$scope', '$location', '$timeout', 'userService', 'authService', '$rootScope','$anchorScroll', SettingsController]);
app.controller('PasswordResetCtrl', ['$scope','$location','$routeParams','passwordService','authService', PasswordController]);

// Web controllers
app.controller('HomeCtrl', ['$scope', '$location','$anchorScroll', 'userService', '$rootScope', 'authService', HomeController]);
app.controller('FaqCtrl', ['$scope', '$location', FaqController]);
app.controller('TeamCtrl', ['$scope', '$location', TeamController]);
app.controller('PressCtrl', ['$scope', '$location', PressController]);
app.controller('MenuCtrl', ['$scope', '$location', '$routeParams', MenuController]);

// Directives
app.directive('websiteNav', [websiteNav]);
app.directive('headerNav', [headerNav]);
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
app.directive('comment', ['$compile', 'commentService', '$anchorScroll', '$timeout', '$location', commentDirective]);
app.directive('commentEvent', ['$compile', 'commentService', commentEventDirective]);
app.directive('comments', [commentsDirective]);
app.directive('banner', [bannerDirective]);
app.directive('timeline', [timelineDirective]);
app.directive('following', ['$location', timelineFollowingEventDirective]);
app.directive('followed', ['$location', timelineFollowedEventDirective]);
app.directive('vote', ['$location', voteEventDirective]);
app.directive('notifications', ['$location', notificationsDirective]);
app.directive('commentreply', ['$location', commentReplyNotificationDirective]);
app.directive('trends', ['$location',trendsDirective]);
app.directive('autoResize', [autoResizeDirective]);
app.directive('searchBar', ['$sce' ,'$location', search]);
app.directive('termsAndConditions', [termsAndConditionsDirective]);


