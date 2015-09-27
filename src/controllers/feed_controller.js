var Banner = require('../models/banner.js');

FeedController = function($scope, $location, userService) {
    $scope = $scope || {};
    $location = $location || {};
    var user = userService.getUser();
    $scope.banner = new Banner(user);
};

module.exports = FeedController;
