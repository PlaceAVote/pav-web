var Banner = require('../models/banner.js');
var AuthorizeController = require('./autherize_controller.js');
var title = require('../config/titles.js');
var BillSummary = require('../models/bill_summary.js');
var Issue = require('../models/issue.js');
var SubFeedController = require('./sub_feed_controller.js');
var Feedback = require('../models/feedback_feed_event.js');

FeedController = function($scope, $location, userService, billService, authService, feedService, $rootScope, $timeout, searchService) {
  AuthorizeController.authorize({error: '/', authorizer: authService, location: $location});
  this.$scope = $scope || {};
  $scope.$location = $location || {};
  this.billService = billService;
  this.userService = userService;
  this.feedService = feedService;
  this.searchService = searchService;
  this.zipExpression = /^\d{5}(?:[-\s]\d{4})?$/;
  this.timeout = $timeout;
  this.rs = $rootScope;
  this.rs.inApp = true;

  this.categories = {
    all: new SubFeedController({name: 'all', icon: 'icon-globe', title: 'All Activity', noun: 'everything'}),
    following: new SubFeedController({name: 'following', icon: 'icon-add', title: 'Following', noun: 'people'}),
    billActivity: new SubFeedController({name: 'billActivity', icon: 'icon-bills', title: 'Bill Activity', noun: 'bills'}),
    discovery: new SubFeedController({
      name: 'discovery',
      icon: 'icon-binoculars',
      title: 'Discovery',
      categories:
        [
          new SubFeedController({name: 'trends', title: 'Trends',}),
          new SubFeedController({name: 'politics', title: 'Politics',}),
          new SubFeedController({name: 'technology', title: 'Technology',}),
          new SubFeedController({name: 'gun', title: 'Guns',}),
          new SubFeedController({name: 'education', title: 'Education',}),
          new SubFeedController({name: 'healthcare', title: 'Healthcare',}),
          new SubFeedController({name: 'defense', title: 'Defense',}),
          new SubFeedController({name: 'economics', title: 'Economics',}),
          new SubFeedController({name: 'immigration', title: 'Immigration',}),
          new SubFeedController({name: 'social', title: 'Social Interest',}),
          new SubFeedController({name: 'taxes', title: 'Taxes',}),
          new SubFeedController({name: 'healthcare', title: 'Healthcare',}),
        ],
    }),
  };
  // Prepopulate with a feedback event.
  this.categories.all.push([new Feedback({ link: 'http://goo.gl/forms/UMEmQll6XSpeIy4G2' })]);

  this.categories.discovery.selectedCategory = this.categories.discovery.categories.trends;
  this.selectedCategory = this.categories.all;
  this.getTrends();
  var that = this;
  this.getUserProfile(function(err, response) {
    if (err) {
      if (err.status === 401) {
        $location.path('/');
      }
    } else {
      $rootScope.notLoggedIn = false;
      $scope.user = response;
      $scope.banner = new Banner(response);
      that.showZipModal();
    }
  });

  this.getFeed();
};

FeedController.prototype.updateZip = function() {
  if (!this.zipExpression.test(this.zipCode)) {
    this.invalidZip = true;
    return;
  }
  this.invalidZip = false;
  this.zipModal = false;
  var body = {
    zipcode: this.zipCode,
  };
  var that = this;
  this.userService.saveUserSettings(body, function(err, result) {
    that.rs.shownZipModal = true;
    if (err || !result) {
      return;
    }
    if (result.zipcode) {
      that.rs.user.zipcode = result.zipcode;
    }
    if (result.district) {
      that.rs.user.district = result.district;
    }
    if (result.state) {
      that.rs.user.state = result.state;
    }
  });
};

FeedController.prototype.showZipModal = function() {
  if (!this.rs || !this.rs.user || this.rs.shownZipModal) {
    return;
  }
  if (!this.rs.user.district || !this.rs.user.state) {
    this.zipModal = true;
  }
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


FeedController.prototype.subCategoryClick = function(categoryName, subCategoryName) {
  var that = this;
  this.itemsLoading = true;
  if (categoryName !== 'discovery') {
    return;
  }
  if (categoryName === 'discovery' && subCategoryName === 'trends') {
    this.itemsLoading = false;
    this.selectedCategory.selectedCategory = this.categories[categoryName].categories[subCategoryName];
    return;
  }

  this.selectedCategory = this.categories[categoryName];
  this.selectedCategory.selectedCategory = this.categories[categoryName].categories[subCategoryName];
  if (!this.selectedCategory.selectedCategory) {
    return;
  }
  this.searchService.bills(subCategoryName, function(err, results) {
    if (err) {
      return;
    }
    // Sorts by comment count in DESC
    results.sort(function(a, b) {
      return b.comment_count - a.comment_count;
    });
    that.selectedCategory.selectedCategory.update(results);
    that.itemsLoading = false;
  });

};

FeedController.prototype.isSelectedCategory = function(category) {
  if (this.selectedCategory.name !== category) {
    return false;
  }
  return true;
};

FeedController.prototype.isSelectedSubCategory = function(category, sub) {
  if (this.selectedCategory.name !== category) {
    return false;
  }
  if (this.selectedCategory.selectedCategory && this.selectedCategory.selectedCategory.name === sub) {
    return true;
  }
  return false;
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
  this.selectedCategory = this.categories[name] || this.categories.all;
  if (this.selectedCategory.categories) {
    this.selectedCategory.showCategories = true;
  }
  if (this.selectedCategory.count === 0) {
    this.feedCheck();
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
      var mappedTrends = res.map(function(re) {
        return re;
      });
      that.categories.discovery.categories.trends.update(mappedTrends);
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
      if (!response.feed || response.feed.length > 0) {
        that.populateFeed(response);
      }
      that.lastLoaded = response.last_timestamp;
    }
  });
};

FeedController.prototype.populateFeed = function(response) {
  this.categories.all.push(response.feed);
  this.categories.following.filter(response.feed, ['issue']);
  this.categories.billActivity.filter(response.feed, ['bill', 'vote', 'comment']);
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
        that.feedMessage('.');
      } else {
        that.lastLoaded = response.last_timestamp;
        that.populateFeed(response);
      }
    }
  });
};

FeedController.prototype.feedMessage = function(message) {
  this.scrollMessage = message;
};

module.exports = FeedController;
