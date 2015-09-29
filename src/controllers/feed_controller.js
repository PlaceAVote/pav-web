var Banner = require('../models/banner.js');

FeedController = function($scope, $location, userService, billService) {
    $scope = $scope || {};
    $location = $location || {};
    var user = userService.getUser();
    $scope.user = user;
    $scope.banner = new Banner(user);
    billService.get(user.email, function(err, response){
        if(!err){
            $scope.bills = response;
        }
    };
};

module.exports = FeedController;
