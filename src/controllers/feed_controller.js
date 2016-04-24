var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');
var SubFeedController = require('./sub_feed_controller.js');

FeedController = function($scope, $location, userService, billService, authService, feedService, $rootScope, $timeout) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.billService = billService;
  this.userService = userService;
  this.feedService = feedService;
  this.timeout = $timeout;
  this.rs = $rootScope;
  this.rs.inApp = true;
  this.categories = {
    all: new SubFeedController({name: 'all', title: 'All Activity',}),
    discovery: new SubFeedController({
      name: 'discovery',
      title: 'Discovery',
      categories:
        [
          new SubFeedController({name: 'trends', title: 'Trends',}),
          new SubFeedController({name: 'justice', title: 'Justice',}),
          new SubFeedController({name: 'technology', title: 'Technology',}),
          new SubFeedController({name: 'guns', title: 'Guns',}),
          new SubFeedController({name: 'education', title: 'Education',}),
          new SubFeedController({name: 'healthcare', title: 'Healthcare',}),
        ],
    }),
  };
  this.categories.discovery.selectedCategory = this.categories.discovery.categories.trends;
  this.selectedCategory = this.categories.all;
  this.getTrends();
  this.getUserProfile(function(err, response) {
    var that = this;
    if (err) {
      if (err.status === 401) {
        $location.path('/');
      }
    } else {
      $rootScope.notLoggedIn = false;
      $scope.user = response;
      $scope.banner = new Banner(response);
    }
  });

  this.getFeed();
};

FeedController.prototype.getUserProfile = function(callback) {
  this.userService.getUserProfile('me', callback);

};

FeedController.prototype.categoryCount = function(name) {
  var cat = this.categories[name];
  if (!cat) {
    return 0;
  }
  switch (name) {
    case 'discovery': {
      return cat.categories.trends.count;
    }
    default: {
      return cat.count;
    }
  }
};

FeedController.prototype.subCount = function(catName, subName) {
  var cat = this.categories[catName];
  if (!cat) {
    return;
  }
  switch (catName) {
    case 'discovery': {
      if (subName === 'trends') {
        return cat.categories.trends.count;
      }
      return;
    }
    default: {
      return cat.count;
    }
  }
};

FeedController.prototype.categoryClick = function(name) {
  this.selectedCategory.showCategories = false;
  this.selectedCategory = this.categories[name] || this.categories.all;
  if (this.selectedCategory.categories) {
    this.selectedCategory.showCategories = true;
  }
};


FeedController.prototype.getTrends = function() {
  var that = this;
  this.trendsLoading = true;
  this.billService.getTrends(function(err, res) {
    that.trendsLoading = false;
    that.trends = false;
    if (!err) {
      that.trends = res;
      that.categories.discovery.categories.trends.update(res);
    }
  });
};

FeedController.prototype.getFeed = function() {
  var that = this;
  this.loading = true;
  this.feedService.getFeed(undefined, function(err, response) {
    that.loading = false;
    if (!err) {
      title.feed();
      that.categories.all.update(response.feed);
      that.lastLoaded = response.last_timestamp;
    }
  });
};

FeedController.prototype.feedCheck = function() {
  var that = this;
  if (this.loadingScroll || this.newTimestamp === this.lastLoaded) {
    return;
  }
  this.newTimestamp = this.lastLoaded;
  this.loadingScroll = true;
  this.feedService.getFeed(this.newTimestamp, function(err, response) {
    that.loadingScroll = false;
    if (!err) {
      title.feed();
      if (response.last_timestamp === null) {
        that.categories.all.update(response.feed);
        that.feedMessage('.');
      } else {
        that.lastLoaded = response.last_timestamp;
        that.categories.all.update(response.feed);
      }
    }
  });
};

FeedController.prototype.feedMessage = function(message) {
  this.scrollMessage = message;
};

module.exports = FeedController;
