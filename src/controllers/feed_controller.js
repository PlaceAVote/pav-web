var Banner = require('../models/banner.js');

FeedController = function($scope, $location, userService) {
    $scope = $scope || {};
    $location = $location || {};
    var user = userService.getUser();
    $scope.user = user;
    $scope.banner = new Banner(user);
};

module.exports = FeedController;
