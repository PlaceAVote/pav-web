console.log('%cPlaceavote', 'background: #543594; color: #ffffff; padding: 1px 3px; border-radius: 3px; font-size: 12px;font-family: sans-serif; margin-left: calc(100% - 70px);');


// Redirects to https protocol

if (window.location.protocol != 'https:' && window.location.hostname != 'localhost') {
  window.location.href = window.location.href.replace(/^http:/, 'https:');
}

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

// Thirdparty integrations
var Facebook = require('./integrations/facebook.js');
var Twitter = require('./integrations/twitter.js');
var slider = require('angularjs-slider');
var draggable = require('angular-ui-tree');
var textarea = require('angular-elastic');
var moment = require('angular-moment');
var locationUpdate = require('./utils/location_update.js');

var app = angular.module('pavApp', [require('angular-route'), require('angular-animate'), require('angular-resource'), require('angular-sanitize'), 'rzModule', 'ui.tree', 'monospaced.elastic', 'angularMoment', 'ngLocationUpdate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

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
    templateUrl: 'partials/feed.html',
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

  $locationProvider
    .hashPrefix('!');

},]);

// Services
app.factory('facebookService', [Facebook]);
app.factory('twitterService', [Twitter]);
app.factory('authService', ['$resource', AuthService]);
app.factory('userService', ['$resource', 'facebookService', 'authService', UserService]);
app.factory('billService', ['$resource', 'authService', 'userService', BillService]);
app.factory('commentService', ['$resource', 'userService', 'authService', CommentService]);
app.factory('legislationService', ['$resource', 'authService', LegislatorService]);
app.factory('voteService', ['$resource', 'authService', 'userService', VoteService]);
app.factory('notificationService', ['$resource', 'authService', NotificationService]);
app.factory('searchService', ['$resource', 'authService', SearchService]);
app.factory('passwordService', ['$resource', PasswordService]);
app.factory('feedService', ['$resource', 'authService', 'userService', FeedService]);
app.factory('issueService', ['$resource', 'authService', IssueService]);
app.factory('questionService', ['$resource', 'authService', QuestionService]);
app.factory('mailService', ['$resource', MailService]);

// Controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', '$rootScope', RegisterController]);
app.controller('SignUpCtrl',['$rootScope','$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', 'authService', '$rootScope', '$routeParams', 'passwordService', '$timeout', LoginController]);
app.controller('FeedCtrl', ['$scope', '$location', 'userService', 'billService', 'authService', 'feedService', '$rootScope','$timeout', FeedController]);
app.controller('BillCtrl', ['$scope', '$routeParams', 'billService', 'legislationService', 'voteService', 'commentService', '$location', 'authService', '$rootScope', '$timeout', 'facebookService', '$route', BillController]);
app.controller('HeaderCtrl', ['$rootScope', '$scope', '$location', '$timeout', 'authService', 'userService', 'notificationService', 'searchService', '$window', '$route', HeaderController]);
app.controller('ProfileCtrl', ['$scope', '$location', '$routeParams', 'authService', 'userService','issueService', '$rootScope', ProfileController]);
app.controller('SettingsCtrl', ['$scope', '$location', '$timeout', 'userService', 'authService', '$rootScope','$anchorScroll', SettingsController]);
app.controller('PasswordResetCtrl', ['$scope','$location','$routeParams','passwordService','authService', PasswordController]);
app.controller('IssuesCtrl', ['$scope', '$rootScope', 'searchService', '$timeout', 'issueService', IssuesController]);
app.controller('WizardCtrl', ['$scope', 'questionService','$rootScope', WizardController]);

// Web controllers
app.controller('HomeCtrl', ['$scope', '$location','$anchorScroll', 'userService', '$rootScope', 'authService', HomeController]);
app.controller('FaqCtrl', ['$scope', '$location', FaqController]);
app.controller('TeamCtrl', ['$scope', '$location', TeamController]);
app.controller('PressCtrl', ['$scope', '$location', PressController]);
app.controller('MenuCtrl', ['$scope', '$location', '$routeParams', MenuController]);
app.controller('ContactCtrl', ['$scope', '$timeout', 'mailService', ContactController]);

// Values
app.value('THROTTLE_MILLISECONDS', null);

// Directives
app.directive('websiteNav', [websiteNav]);
app.directive('headerNav', [headerNav]);
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
app.directive('comment', ['$compile', 'commentService', '$anchorScroll', '$timeout', '$location', '$window', commentDirective]);
app.directive('commentEvent', ['$compile', 'commentService', '$timeout','$location', commentEventDirective]);
app.directive('comments', [commentsDirective]);
app.directive('banner', [bannerDirective]);
app.directive('timeline', ['$location', timelineDirective]);
app.directive('following', ['$location', timelineFollowingEventDirective]);
app.directive('followed', ['$location', timelineFollowedEventDirective]);
app.directive('vote', ['$location', voteEventDirective]);
app.directive('notifications', ['$location', notificationsDirective]);
app.directive('commentreply', ['$location', commentReplyNotificationDirective]);
app.directive('trends', ['$location',trendsDirective]);
app.directive('websiteFooter', [websiteFooter]);
app.directive('searchBar', ['$sce' ,'$location', search]);
app.directive('termsAndConditions', [termsAndConditionsDirective]);
app.directive('issuesPost', [issuesPostDirective]);
app.directive('issue', ['$location', 'issueService', 'facebookService', '$window', 'userService', issueDirective]);
app.directive('wizard', [wizardDirective]);
app.directive('slider', ['$timeout', sliderDirective]);
app.directive('dad', [dragAndDropDirective]);
app.directive('tax', ['$filter', '$location','$anchorScroll',taxMultiDirective]);
app.directive('imageCrop', [imageCropDirective]);
app.directive('fileread', [fileReadDirective]);
app.directive('loader', ['$location', preloaderDirective]);
app.directive('feedEvents', [feedEventsDirective]);
app.directive('invalid', [invalidDirective]);
app.directive('feedBillEvent', ['$location', 'facebookService', feedBillEventDirective]);
app.directive('infiniteScroll', ['$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS', infiniteScroll]);
app.directive('billSummary', ['$location', billSummaryDirective]);
app.directive('billInfo', ['$location', billInfoDirective]);
app.directive('billComments', ['$location', billCommentsDirective]);
app.directive('billStatistics', ['$location', billStatisticsDirective]);
app.directive('billStatus', ['$location', billStatusDirective]);
app.directive('voteModal', ['$location', voteModalDirective]);
app.directive('voteConfirmed', ['$location', voteConfirmedDirective]);
app.directive('imageSmart', [imageSmartDirective]);
app.directive('updateMeta', ['$log', updateMetaDirective]);
app.directive('compile', ['$compile', '$window', compileDirective]);
app.directive('feedVoteEvent', ['$location', feedVoteEventDirective]);
app.directive('feedCommentEvent', ['$location', feedCommentEventDirective]);
