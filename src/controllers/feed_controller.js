var Banner = require('../models/banner.js');

FeedController = function($scope, $location, userService, billService) {
    $scope = $scope || {};
    $location = $location || {};
    var user = userService.getUser();
    if(!user){
        $location.path('/');
    }
    $scope.user = user;
    $scope.banner = new Banner(user);
    billService.getBills(user.email, function(err, response){
        if(!err){
            $scope.bills = response;
            console.log($scope.bills);
        }
    });
};

module.exports = FeedController;
