// Controllers
var RegisterController = require('./controllers/register_controller.js');
var SignUpController = require('./controllers/sign_up_controller.js');
var LoginController = require('./controllers/login_controller.js');
// Services
var UserService = require('./services/user_service.js');
// Directives
var mailcheck = require('./directives/mailcheck.js');

var app = angular.module('pav', ['ionic', require('angular-route'), require('angular-resource')]);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Required: org.apache.cordova.statusbar
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('app', {
    url: '/app',
    templateUrl: 'partials/login_ionic.html',
    controller: 'LoginCtrl',
  });
  $urlRouterProvider.otherwise('/app');
});

// Services
app.factory('userService', [UserService]);

// Controllers
app.controller('TopicRegisterCtrl',['$scope','$location', 'userService', RegisterController]);
app.controller('SignUpCtrl',['$scope','$location', 'userService', SignUpController]);
app.controller('LoginCtrl',['$scope','$location', 'userService', LoginController]);

// Directives
app.directive('mailcheck', ['$compile','$sce', mailcheck]);
