(function() {
var PAV = window.PAV || {};
var config = require('./config/urls.js');
console.log('%cPlaceavote', 'background: #543594; color: #ffffff; padding: 1px 3px; border-radius: 3px; font-size: 12px;font-family: sans-serif; margin-left: calc(100% - 70px);');

// Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
// Throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
// To avoid the entire page breaking, without having to do a check at each usage of Storage.
if (typeof localStorage === 'object') {
  try {
    localStorage.setItem('localStorage', 1);
    localStorage.removeItem('localStorage');
  } catch (e) {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function() {};
  }
}
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
var FeedService = require('./services/feed_service.js');
var IssueService = require('./services/issue_service.js');
var QuestionService = require('./services/question_service.js');
var MailService = require('./services/mail_service.js');
var OpenGraphService = require('./services/open_graph_service.js');
var EmailService = require('./services/email_service.js');
var google = require('./services/google.js');

// Dependencies
var angular = require('angular');

// Thirdparty integrations
var Facebook = require('./integrations/facebook.js');
var googleApi = require('./integrations/google.js');
var Twitter = require('./integrations/twitter.js');
var slider = require('angularjs-slider');
var draggable = require('angular-ui-tree');
var textarea = require('angular-elastic');
var moment = require('angular-moment');
var locationUpdate = require('./utils/location_update.js');

var GoogleAnalytics = require('angular-google-analytics');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), require('angular-sanitize'), 'rzModule', 'ui.tree', 'monospaced.elastic', 'angularMoment', 'ngLocationUpdate', 'angular-google-analytics']);

app.config(['$routeProvider', '$locationProvider', '$compileProvider', 'AnalyticsProvider', function($routeProvider, $locationProvider, $compileProvider, AnalyticsProvider) {

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
  controller: 'TopicRegisterCtrl as topicsRegister',
	})
  .when('/register', {
    templateUrl: 'partials/signup.html',
    controller: 'SignUpCtrl as signup',
  })
  .when('/feed', {
    templateUrl: 'partials/feed/feed.html',
    controller: 'FeedCtrl as feed',
  })
  .when('/bill/:id', {
    templateUrl: 'partials/bills/bill_wrapper.html',
    controller: 'BillCtrl as bill',
  })
  .when('/bill/:id/summary', {
    templateUrl: 'partials/bills/bill_wrapper.html',
    controller: 'BillCtrl as bill',
  })
  .when('/bill/:id/info', {
    templateUrl: 'partials/bills/bill_wrapper.html',
    controller: 'BillCtrl as bill',
  })
  .when('/bill/:id/comments', {
    templateUrl: 'partials/bills/bill_wrapper.html',
    controller: 'BillCtrl as bill',
  })
  .when('/bill/:id/statistics', {
    templateUrl: 'partials/bills/bill_wrapper.html',
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
  .when('/issue/:issueid', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileCtrl as profile',
  })
  .otherwise({
    redirectTo: '/',
  });

  $locationProvider.hashPrefix('!');

  $compileProvider.debugInfoEnabled(config.WATCHERS);

  AnalyticsProvider.setAccount('UA-48538409-1');

},]);

app.run(['Analytics', function(Analytics) {}]);

// Services
app.factory('facebookService', Facebook);
app.factory('googleApi', googleApi);
app.factory('google', google);
google.$inject = ['googleApi'];
app.factory('twitterService', Twitter);
app.factory('authService', AuthService);
AuthService.$inject = ['$resource'];
app.factory('userService', UserService);
UserService.$inject = ['$resource', 'facebookService', 'authService'];
app.factory('billService', BillService);
BillService.$inject = ['$resource', 'authService', 'userService'];
app.factory('commentService', CommentService);
CommentService.$inject = ['$resource', 'userService', 'authService'];
app.factory('legislationService', LegislatorService);
LegislatorService.$inject = ['$resource', 'authService'];
app.factory('voteService', VoteService);
VoteService.$inject = ['$resource', 'authService', 'userService'];
app.factory('notificationService', NotificationService);
NotificationService.$inject = ['$resource', 'authService'];
app.factory('searchService', SearchService);
SearchService.$inject = ['$resource', 'authService'];
app.factory('passwordService', PasswordService);
PasswordService.$inject = ['$resource'];
app.factory('feedService', FeedService);
FeedService.$inject = ['$resource', 'authService', 'userService'];
app.factory('issueService', IssueService);
IssueService.$inject = ['$resource', 'authService'];
app.factory('questionService', QuestionService);
QuestionService.$inject = ['$resource', 'authService'];
app.factory('mailService', MailService);
MailService.$inject = ['$resource'];
app.factory('openGraphService', OpenGraphService);
OpenGraphService.$inject = ['$resource'];
app.factory('emailService', EmailService);
EmailService.$inject = ['$resource', 'authService'];

// Values
app.value('THROTTLE_MILLISECONDS', null);

function bind(params) {
  var pav = PAV || {};
  app[params.func](params.name, PAV[params.global]);
  console.log(pav);
  if (params.deps) {
    PAV[params.global].$inject = params.deps;
  }
}


function register(params) {
  var dep = document.createElement('script');
  dep.type = 'text/javascript';
  dep.onerror = function() {
    console.log('error with crl', params.route);
  };
  dep.onload = function() {
    bind(params);
  };
  dep.src = 'dist/js/' +  params.path + '-min.js';
  document.body.appendChild(dep);
}

// Controllers
var ctrls = [
  { name: 'TopicRegisterCtrl', path: 'register_controller', global: 'registerController', func: 'controller', deps: ['$scope', '$location', 'userService', '$rootScope'] },
  { name: 'SignUpCtrl', path: 'sign_up_controller', global: 'signUpController', func: 'controller', deps: ['$rootScope','$scope','$location', 'userService', 'authService', 'Analytics'] },
  { name: 'LoginCtrl', path: 'login_controller', global: 'loginController', func: 'controller', deps: ['$scope','$location', 'userService', 'authService', '$rootScope', '$routeParams', 'passwordService', '$timeout', '$window', 'Analytics'] },
  { name: 'FeedCtrl', path: 'feed_controller', global: 'feedController', func: 'controller', deps: ['$scope', '$location', 'userService', 'billService', 'authService', 'feedService', '$rootScope','$timeout', 'searchService'] },
  { name: 'BillCtrl', path: 'bill_controller', global: 'billController', func: 'controller', deps: ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', '$rootScope', '$timeout', 'facebookService', '$route'] },
  { name: 'HeaderCtrl', path: 'header_controller', global: 'headerController', func: 'controller', deps: ['$rootScope', '$scope', '$location', '$timeout', 'authService', 'userService', 'notificationService', 'searchService', '$window', '$route'] },
  { name: 'ProfileCtrl', path: 'profile_controller', global: 'profileController', func: 'controller', deps: ['$scope', '$location', '$routeParams', 'authService', 'userService','issueService', '$rootScope'] },
  { name: 'SettingsCtrl', path: 'settings_controller', global: 'settingsController', func: 'controller', deps: ['$scope', '$location', '$timeout', 'userService', 'authService', '$rootScope','$anchorScroll'] },
  { name: 'PasswordResetCtrl', path: 'password_controller', global: 'passwordController', func: 'controller', deps: ['$scope','$location','$routeParams','passwordService', 'authService'] },
  { name: 'IssuesCtrl', path: 'issues_controller', global: 'issuesController', func: 'controller', deps: ['$scope', '$rootScope', 'searchService', '$timeout', 'issueService', 'openGraphService'] },
  { name: 'WizardCtrl', path: 'wizard_controller', global: 'wizardController', func: 'controller', deps: ['$scope', 'questionService','$rootScope'] },
  { name: 'EmailCtrl', path: 'email_controller', global: 'emailController', func: 'controller', deps: ['google', 'emailService', '$scope'] },
  { name: 'ContactCtrl', path: 'contact_controller', global: 'contactController', func: 'controller', deps: ['$scope', '$timeout','mailService'] },
  { name: 'HomeCtrl', path: 'home_controller', global: 'homeController', func: 'controller', deps: ['$scope', '$location','$anchorScroll', 'userService', '$rootScope', 'authService'] },
  { name: 'FaqCtrl', path: 'faq_controller', global: 'faqController', func: 'controller', deps: ['$scope', '$location'] },
  { name: 'TeamCtrl', path: 'team_controller', global: 'teamController', func: 'controller', deps: ['$scope', '$location'] },
  { name: 'PressCtrl', path: 'press_controller', global: 'pressController', func: 'controller', deps: ['$scope', '$location'] },
  { name: 'MenuCtrl', path: 'menu_controller', global: 'menuController', func: 'controller', deps: ['$scope', '$location', '$routeParams'] },
  { name: 'websiteNav', path: 'website_nav', global: 'websiteNavDirective', func: 'directive' },
  { name: 'headerNav', path: 'header_directive', global: 'headerNavDirective', func: 'directive' },
  { name: 'pavDate', path: 'pavXBrowserDate', global: 'pavXBrowserDateDirective', func: 'directive' },
  { name: 'mailcheck', path: 'mailcheck', global: 'mailCheckDirective', func: 'directive', deps: ['$compile', '$sce'] },
  { name: 'comment', path: 'comment', global: 'commentDirective', func: 'directive', deps: ['$compile', 'commentService', '$anchorScroll', '$timeout', '$location', '$window', 'userService'] },
  { name: 'comments', path: 'comments', global: 'commentsDirective', func: 'directive' },
  { name: 'openGraph', path: 'open_graph', global: 'openGraphDirective', func: 'directive' },
  { name: 'banner', path: 'banner', global: 'bannerDirective', func: 'directive' },
  { name: 'timeline', path: 'timeline', global: 'timelineDirective', func: 'directive', deps: ['$location'] },
  { name: 'following', path: 'following_event', global: 'followingEventDirective', func: 'directive', deps: ['$location'] },
  { name: 'followed', path: 'followed_event', global: 'followedEventDirective', func: 'directive', deps: ['$location'] },
  { name: 'vote', path: 'vote_event', global: 'voteEventDirective', func: 'directive', deps: ['$location'] },
  { name: 'notifications', path: 'notifications', global: 'notificationsDirective', func: 'directive', deps: ['$location'] },
  { name: 'commentreply', path: 'comment_reply_notification', global: 'commentReplyNotificationDirective', func: 'directive', deps: ['$location'] },
  { name: 'trends', path: 'trends', global: 'trendsDirective', func: 'directive', deps: ['$location'] },
  { name: 'websiteFooter', path: 'footer', global: 'footerDirective', func: 'directive' },
  { name: 'searchBar', path: 'search', global: 'searchBarDirective', func: 'directive', deps: ['$sce', '$location'] },
  { name: 'termsAndConditions', path: 'terms_and_conditions', global: 'termsAndConditionsDirective', func: 'directive' },
  { name: 'issuesPost', path: 'issues_post', global: 'issuesPostDirective', func: 'directive' },
  { name: 'issue', path: 'issue', global: 'issueDirective', func: 'directive', deps: ['$location', 'issueService', 'facebookService', '$window', 'userService', '$timeout', '$compile'] },
  { name: 'wizard', path: 'wizard', global: 'wizardDirective', func: 'directive' },
  { name: 'slider', path: 'wizard_slider', global: 'sliderDirective', func: 'directive', deps: ['$timeout'] },
  { name: 'dad', path: 'wizard_drag_and_drop', global: 'dragAndDropDirective', func: 'directive' },
  { name: 'tax', path: 'wizard_tax_multi', global: 'taxMultiDirective', func: 'directive', deps: ['$filter', '$location', '$anchorScroll'] },
  { name: 'imageCrop', path: 'imagecrop', global: 'imageCropDirective', func: 'directive' },
  { name: 'fileread', path: 'fileread', global: 'fileReadDirective', func: 'directive' },
  { name: 'loader', path: 'preloader', global: 'preloaderDirective', func: 'directive', deps: ['$location'] },
  { name: 'feedEvents', path: 'feed_events', global: 'feedEventsDirective', func: 'directive' },
  { name: 'invalid', path: 'invalid', global: 'invalidDirective', func: 'directive' },
  { name: 'feedBillEvent', path: 'feed_bill_event', global: 'feedBillEventDirective', func: 'directive', deps: ['$location', 'facebookService'] },
  { name: 'infiniteScroll', path: 'infinite_scroll', global: 'infiniteScrollDirective', func: 'directive', deps: ['$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS'] },
  { name: 'billSummary', path: 'bill_summary', global: 'billSummaryDirective', func: 'directive', deps: ['$location'] },
  { name: 'billInfo', path: 'bill_info', global: 'billInfoDirective', func: 'directive', deps: ['$location'] },
  { name: 'billComments', path: 'bill_comments', global: 'billCommentsDirective', func: 'directive', deps: ['$location'] },
  { name: 'billStatistics', path: 'bill_statistics', global: 'billStatisticsDirective', func: 'directive', deps: ['$location'] },
  { name: 'billStatus', path: 'bill_status', global: 'billStatusDirective', func: 'directive', deps: ['$location'] },
  { name: 'voteModal', path: 'vote_modal', global: 'voteModalDirective', func: 'directive', deps: ['$location'] },
  { name: 'voteConfirmed', path: 'vote_confirmed', global: 'voteConfirmedDirective', func: 'directive', deps: ['$location'] },
  { name: 'imageSmart', path: 'image_smart', global: 'imageSmartDirective', func: 'directive' },
  { name: 'updateMeta', path: 'update_meta', global: 'updateMetaDirective', func: 'directive', deps: ['$log'] },
  { name: 'compile', path: 'compile', global: 'compileDirective', func: 'directive', deps: ['$compile', '$window', '$sce', '$sanitize'] },
  { name: 'feedVoteEvent', path: 'feed_vote_event', global: 'feedVoteEventDirective', func: 'directive', deps: ['$location'] },
  { name: 'feedCommentEvent', path: 'feed_comment_event', global: 'feedCommentEventDirective', func: 'directive', deps: ['$location'] },
  { name: 'allactivityfeed', path: 'all_activity_feed', global: 'allActivityFeedDirective', func: 'directive' },
  { name: 'trendsactivityfeed', path: 'trends_activity_feed', global: 'trendsActivityFeedDirective', func: 'directive' },
  { name: 'cssScroll', path: 'css_scroll', global: 'cssScrollDirective', func: 'directive' },
  { name: 'issueModal', path: 'issue_modal', global: 'issueModalDirective', func: 'directive', deps: ['$location', '$timeout', 'issueService', '$rootScope'] },
  { name: 'icon', path: 'icon', global: 'iconDirective', func: 'directive' },
  { name: 'pieChart', path: 'ring_chart', global: 'pieChartDirective', func: 'directive' },
  { name: 'emailConnections', path: 'email_connections', global: 'emailConnectionsDirective', func: 'directive' },
  { name: 'finishedRender', path: 'finished_render', global: 'finishedRenderDirective', func: 'directive' },
];
for (var i = 0, len = ctrls.length - 1; len >= i; len --) {
  register(ctrls[len]);
}
})();
