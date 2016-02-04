function IssuesController($scope, $rootScope, searchService, $timeout) {
  this.rs = $rootScope;
  this.scope = $scope;
  this.post;
  this.searchService = searchService;
  this.timeout = $timeout;
  this.issue = {}
  this.attachments = [];
};

//  {
//    comment:  
//    bill_id:  
//    article_link:
// }


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
  for (i in this.attachments) {
    if (that.attachments[i].type === 'Bill') {
      that.setError('Bill already attached');
      return;
    }
  } 
  this.billSearch ? this.billSearch = false : this.billSearch = true;
};

IssuesController.prototype.setError = function(message) {
  var that = this
  this.errorMessage = message;
  this.timeout(function(){
    that.errorMessage = false;
  }, 2000);
}

IssuesController.prototype.toggleLink = function() {
  this.billSearch = false;
  this.linkAdd ? this.linkAdd = false : this.linkAdd = true;
};

IssuesController.prototype.attach = function(attachment) {
  var that = this;
  if (attachment.type === 'bill') {
    that.issue.bill_id = attachment.bill_id;
    that.attachments.push({
      type: 'Bill',
      title: attachment.short_title || attachment.official_title,
    });
    that.billSearch = false;
  }
}

IssuesController.prototype.deleteAttachment = function(i) {
  this.attachments.splice(i, 1);
};

module.exports = IssuesController
