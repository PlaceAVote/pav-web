function IssuesController($scope, $rootScope, searchService, $timeout, issueService) {
  this.rs = $rootScope;
  this.scope = $scope;
  this.searchService = searchService;
  this.timeout = $timeout;
  this.issue = {};
  this.attachments = [];
  this.issueService = issueService;
}

IssuesController.prototype.search = function(q) {
  var that = this;
  if (this.cachedSearch === q) {
    this.searchResults = this.cachedResults;
    return;
  }
  this.cachedSearch = q;
  this.searching = true;
  this.timeout(function() {
    that.searchService.search(q, function(err, response) {
      if (response) {
        that.searchResults = response;
        that.cachedResults = response;
        that.searching = false;
      }
    });
  }, 500);
};

IssuesController.prototype.toggleSearch = function() {
  var that = this;
  this.linkAdd = false;
  for (var i in this.attachments) {
    if (that.attachments[i].type === 'Bill') {
      that.setError('Bill already attached');
      return;
    }
  }
  if (this.billSearch) {
    that.billSearch = false;
  } else {
    that.billSearch = true;
  }
};

IssuesController.prototype.toggleLink = function() {
  var that = this;
  this.billSearch = false;
  for (var i in this.attachments) {
    if (that.attachments[i].type === 'Article') {
      that.setError('Article already attached');
      return;
    }
  }
  if (this.linkAdd) {
    that.linkAdd = false;
  } else {
    that.linkAdd = true;
  }
};

IssuesController.prototype.setError = function(message) {
  var that = this;
  this.errorMessage = message;
  this.timeout(function() {
    that.errorMessage = false;
  }, 2000);
};

IssuesController.prototype.attach = function(attachment) {
  var that = this;
  if (attachment.type === 'bill') {
    that.attachments.push({
      type: 'Bill',
      title: attachment.short_title || attachment.official_title,
      bill_id: attachment.bill_id,
    });
    that.billSearch = false;
  }

  if (attachment.type === 'article') {
    that.attachments.push({
      type: 'Article',
      title: attachment.article_link,
    });
    that.linkAdd = false;
  }
};

IssuesController.prototype.deleteAttachment = function(i) {
  if (this.attachments[i].type === 'Article') {
    delete this.issue.article_link;
  } else {
    delete this.issue.bill_id;
  }
  this.attachments.splice(i, 1);
};

IssuesController.prototype.validateUrl = function() {
  var that = this;
  var r = new RegExp('^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?');
  if (this.url.match(r)) {
    that.attach({
      article_link: that.url,
      type: 'article',
    });
  } else {
    that.setError('Link entered not valid');
  }
};

IssuesController.prototype.postIssue = function() {
  console.log(this.issue);
  var that = this;
  if (this.issue.comment === '' || !this.issue.comment) {
    that.setError('You need to enter a comment before posting');
    return;
  }
  for (var i in this.attachments) {
    if (that.attachments[i]) {
      if(that.attachments[i].type === 'Article') {
        that.issue.article_link = that.attachments[i].title;
      }
      if(that.attachments[i].type === 'Bill') {
        that.issue.bill_id = that.attachments[i].bill_id;
      }
    }
  }
  console.log(this.issue);
  this.loading = true;
  this.issueService.saveIssue(this.issue, function(err, res) {
    that.loading = false;
    if (err) {
      console.log('err', err);
      that.setError('There was an error when uploading your Issue');
    }
    if (res) {
      console.log('res', res);
    }
  });
};

module.exports = IssuesController;
