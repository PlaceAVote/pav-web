var config = require('./config/urls.js');
var GMAIL = require('./integrations/gmail.js');
var gapi;
GMAIL.load(function(google) {
  console.log('GMAIL', google);
  gapi = google;
});

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

// Website Controllers
var HomeController = require('./controllers/website/home_controller.js');
var FaqController = require('./controllers/website/faq_controller.js');
var TeamController = require('./controllers/website/team_controller.js');
var PressController = require('./controllers/website/press_controller.js');
var MenuController = require('./controllers/website/menu_controller.js');
var ContactController = require('./controllers/website/contact_controller.js');

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
var WizardController = require('./controllers/wizard_controller.js');
var IssuesController = require('./controllers/issues_controller.js');

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

// Dependencies
var d3 = require('d3');
var angular = require('angular');

// Directives
var search = require('./directives/search.js');
var mailcheck = require('./directives/mailcheck.js');
var pavDirectives = require('./directives/directives.js');
var websiteNav = require('./directives/website_nav.js');
var commentsDirective = require('./directives/comments.js');
var commentDirective = require('./directives/comment.js');
var bannerDirective = require('./directives/banner.js');
var timelineDirective = require('./directives/timeline.js');
var timelineFollowingEventDirective = require('./directives/following_event.js');
var timelineFollowedEventDirective = require('./directives/followed_event.js');
var voteEventDirective = require('./directives/vote_event.js');
var headerNav = require('./directives/header_directive.js');
var notificationsDirective = require('./directives/notifications.js');
var commentReplyNotificationDirective = require('./directives/comment_reply_notification.js');
var trendsDirective = require('./directives/trends.js');
var websiteFooter = require('./directives/footer.js');
var termsAndConditionsDirective = require('./directives/terms_and_conditions.js');
var issuesPostDirective = require('./directives/issues_post.js');
var wizardDirective = require('./directives/wizard.js');
var sliderDirective = require('./directives/wizard_slider.js');
var dragAndDropDirective = require('./directives/wizard_drag_and_drop.js');
var taxMultiDirective = require('./directives/wizard_tax_multi.js');
var imageCropDirective = require('./directives/imagecrop.js');
var fileReadDirective = require('./directives/fileread.js');
var preloaderDirective = require('./directives/preloader.js');
var issueDirective = require('./directives/issue.js');
var feedEventsDirective = require('./directives/feed_events.js');
var feedBillEventDirective = require('./directives/feed_bill_event.js');
var infiniteScroll = require('./directives/infinite_scroll.js');
var billSummaryDirective = require('./directives/bills/bill_summary.js');
var billInfoDirective = require('./directives/bills/bill_info.js');
var billCommentsDirective = require('./directives/bills/bill_comments.js');
var billStatisticsDirective = require('./directives/bills/bill_statistics.js');
var billStatusDirective = require('./directives/bills/bill_status.js');
var voteModalDirective = require('./directives/bills/vote_modal.js');
var voteConfirmedDirective = require('./directives/bills/vote_confirmed.js');
var imageSmartDirective = require('./directives/image_smart.js');
var updateMetaDirective = require('./directives/update_meta.js');
var compileDirective = require('./directives/compile.js');
var feedVoteEventDirective = require('./directives/feed_vote_event.js');
var invalidDirective = require('./directives/invalid.js');
var feedCommentEventDirective = require('./directives/feed_comment_event.js');
var allActivityFeedDirective = require('./directives/all_activity_feed.js');
var trendsActivityFeedDirective = require('./directives/trends_activity_feed.js');
var cssScrollDirective = require('./directives/css_scroll.js');
var issueModalDirective = require('./directives/issue_modal.js');
var iconDirective = require('./directives/icon.js');
var pieChartDirective = require('./directives/ring_chart.js');

// Thirdparty integrations
var Facebook = require('./integrations/facebook.js');
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

// Controllers
app.controller('TopicRegisterCtrl', RegisterController);
RegisterController.$inject = ['$scope','$location', 'userService', '$rootScope'];
app.controller('SignUpCtrl', SignUpController);
SignUpController.$inject = ['$rootScope','$scope','$location', 'userService', 'authService', 'Analytics'];
app.controller('LoginCtrl', LoginController);
LoginController.$inject = ['$scope','$location', 'userService', 'authService', '$rootScope', '$routeParams', 'passwordService', '$timeout', '$window', 'Analytics'];
app.controller('FeedCtrl', FeedController);
FeedController.$inject = ['$scope', '$location', 'userService', 'billService', 'authService', 'feedService', '$rootScope','$timeout', 'searchService'];
app.controller('BillCtrl', BillController);
BillController.$inject = ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', '$rootScope', '$timeout', 'facebookService', '$route'];
app.controller('HeaderCtrl', HeaderController);
HeaderController.$inject = ['$rootScope', '$scope', '$location', '$timeout', 'authService', 'userService', 'notificationService', 'searchService', '$window', '$route'];
app.controller('ProfileCtrl', ProfileController);
ProfileController.$inject = ['$scope', '$location', '$routeParams', 'authService', 'userService','issueService', '$rootScope'];
app.controller('SettingsCtrl', SettingsController);
SettingsController.$inject = ['$scope', '$location', '$timeout', 'userService', 'authService', '$rootScope','$anchorScroll'];
app.controller('PasswordResetCtrl', PasswordController);
PasswordController.$inject = ['$scope','$location','$routeParams','passwordService', 'authService'];
app.controller('IssuesCtrl', IssuesController);
IssuesController.$inject = ['$scope', '$rootScope', 'searchService', '$timeout', 'issueService'];
app.controller('WizardCtrl', WizardController);
WizardController.$inject = ['$scope', 'questionService','$rootScope'];

// Web controllers
app.controller('HomeCtrl', HomeController);
HomeController.$inject = ['$scope', '$location','$anchorScroll', 'userService', '$rootScope', 'authService'];
app.controller('FaqCtrl', FaqController);
FaqController.$inject = ['$scope', '$location'];
app.controller('TeamCtrl', TeamController);
TeamController.$inject = ['$scope', '$location'];
app.controller('PressCtrl', PressController);
PressController.$inject = ['$scope', '$location'];
app.controller('MenuCtrl', MenuController);
MenuController.$inject = ['$scope', '$location', '$routeParams'];
app.controller('ContactCtrl', ContactController);
ContactController.$inject = ['$scope', '$timeout', 'mailService'];

// Values
app.value('THROTTLE_MILLISECONDS', null);

// Directives
app.directive('websiteNav', [websiteNav]);
app.directive('headerNav', [headerNav]);
app.directive('mailcheck', mailcheck);
mailcheck.$inject = ['$compile','$sce'];
app.directive('comment', commentDirective);
commentDirective.$inject = ['$compile', 'commentService', '$anchorScroll', '$timeout', '$location', '$window', 'userService'];
app.directive('comments', [commentsDirective]);
app.directive('banner', [bannerDirective]);
app.directive('timeline', timelineDirective);
timelineDirective.$inject = ['$location'];
app.directive('following', timelineFollowingEventDirective);
timelineFollowingEventDirective.$inject = ['$location'];
app.directive('followed', timelineFollowedEventDirective);
timelineFollowedEventDirective.$inject = ['$location'];
app.directive('vote', voteEventDirective);
voteEventDirective.$inject = ['$location'];
app.directive('notifications', notificationsDirective);
notificationsDirective.$inject = ['$location'];
app.directive('commentreply', commentReplyNotificationDirective);
commentReplyNotificationDirective.$inject = ['$location'];
app.directive('trends', trendsDirective);
trendsDirective.$inject = ['$location'];
app.directive('websiteFooter', [websiteFooter]);
app.directive('searchBar', search);
search.$inject = ['$sce' ,'$location'];
app.directive('termsAndConditions', [termsAndConditionsDirective]);
app.directive('issuesPost', [issuesPostDirective]);
app.directive('issue', issueDirective);
issueDirective.$inject = ['$location', 'issueService', 'facebookService', '$window', 'userService', '$timeout', '$compile'];
app.directive('wizard', [wizardDirective]);
app.directive('slider', sliderDirective);
sliderDirective.$inject = ['$timeout'];
app.directive('dad', [dragAndDropDirective]);
app.directive('tax', taxMultiDirective);
taxMultiDirective.$inject = ['$filter', '$location','$anchorScroll'];
app.directive('imageCrop', [imageCropDirective]);
app.directive('fileread', [fileReadDirective]);
app.directive('loader', preloaderDirective);
preloaderDirective.$inject = ['$location'];
app.directive('feedEvents', [feedEventsDirective]);
app.directive('invalid', [invalidDirective]);
app.directive('feedBillEvent', feedBillEventDirective);
feedBillEventDirective.$inject = ['$location', 'facebookService'];
app.directive('infiniteScroll', infiniteScroll);
infiniteScroll.$inject = ['$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS'];
app.directive('billSummary', billSummaryDirective);
billSummaryDirective.$inject = ['$location'];
app.directive('billInfo', billInfoDirective);
billInfoDirective.$inject = ['$location'];
app.directive('billComments', billCommentsDirective);
billCommentsDirective.$inject = ['$location'];
app.directive('billStatistics', billStatisticsDirective);
billStatisticsDirective.$inject = ['$location'];
app.directive('billStatus', billStatusDirective);
billStatusDirective.$inject = ['$location'];
app.directive('voteModal', voteModalDirective);
voteModalDirective.$inject = ['$location'];
app.directive('voteConfirmed', voteConfirmedDirective);
voteConfirmedDirective.$inject = ['$location'];
app.directive('imageSmart', [imageSmartDirective]);
app.directive('updateMeta', updateMetaDirective);
updateMetaDirective.$inject = ['$log'];
app.directive('compile', compileDirective);
compileDirective.$inject = ['$compile', '$window', '$sce', '$sanitize'];
app.directive('feedVoteEvent', feedVoteEventDirective);
feedVoteEventDirective.$inject = ['$location'];
app.directive('feedCommentEvent', feedCommentEventDirective);
feedCommentEventDirective.$inject = ['$location'];
app.directive('allactivityfeed', [allActivityFeedDirective]);
app.directive('trendsactivityfeed', [trendsActivityFeedDirective]);
app.directive('cssScroll', [cssScrollDirective]);
app.directive('issueModal', issueModalDirective);
issueModalDirective.$inject = ['$location', '$timeout', 'issueService', '$rootScope'];
app.directive('icon', iconDirective);
app.directive('pieChart', pieChartDirective);
