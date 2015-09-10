
// Ionic Starter App
//controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
//services
var UserService = require('./services/user_service.js');

//directives
var mailcheck = require('./directives/mailcheck.js');

//dependencies
require('angular');
require('ionic');
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', require('angular-route'), require('angular-animate'), require('angular-resource')]);

console.log("APP");
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

console.log("CONFIG");
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
    .otherwise({
      redirectTo: '/'
    })
}]);

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
