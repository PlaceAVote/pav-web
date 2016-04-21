var issueValidator = require('../utils/validate_issue.js')();
var Issue = require('../models/issue.js');

function IssuesController($scope, $rootScope, searchService, $timeout, issueService) {
  this.rs = $rootScope;
  this.scope = $scope;
  this.searchService = searchService;
  this.timeout = $timeout;
  this.issue = {};
  this.attachments = [];
  this.issueService = issueService;
  this.myIssues = [];
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
  if (!this.url) {
    return;
  }
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

  var scriptExp = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var objectExp = /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi;

  if (scriptExp.test(this.issue.comment) || objectExp.test(this.issue.comment)) {
    this.setError('There was an error posting your issue');
    return;
  }
  var that = this;
  for (var i in this.attachments) {
    if (that.attachments[i]) {
      if (that.attachments[i].type === 'Article') {
        that.issue.article_link = that.attachments[i].title;
      }
      if (that.attachments[i].type === 'Bill') {
        that.issue.bill_id = that.attachments[i].bill_id;
      }
    }
  }
  var valid = issueValidator.validate(this.issue);
  if (!valid) {
    that.setError('You need to enter a comment before posting');
    return;
  }
  this.loading = true;
  this.issueService.saveIssue(this.issue, function(err, res) {
    that.loading = false;
    if (err) {
      that.setError('There was an error when posting your Issue');
    }
    if (res) {
      that.issue = {};
      that.attachments = [];
      that.myIssues.unshift(new Issue(res));
    }
  });
};

module.exports = IssuesController;
