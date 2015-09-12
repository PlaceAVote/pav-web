//controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
//services
var UserService = require('./services/user_service.js');
//directives
var mailcheck = require('./directives/mailcheck.js');

console.log("Hello WORLD");

var app = angular.module('pav', ['ionic', require('angular-route'), require('angular-resource')]);

app.run(function($ionicPlatform) {
  console.log("RUNNING");
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
console.log("In Config");
  $stateProvider.state('app', {
    url : '/app',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  })
$urlRouterProvider.otherwise('/app');
/*
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
*/
});

// app.config(function($stateProvider, $urlRouterProvider) {
//   $stateProvider

//     .state('app', {
//     url: '/app',
//     abstract: true,
//     templateUrl: 'partials/login.html',
//     controller: 'LoginCtrl'
//   })
//   //   .state('app', {
//   //   url: '/app',
//   //   abstract: true,
//   //   templateUrl: 'partials/login.html',
//   //   controller: 'LoginCtrl'
//   // })

//   $urlRouterProvider.otherwise('/app');
// });

//services
app.factory('userService', [UserService]);

//controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', LoginController]);

//directives
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
