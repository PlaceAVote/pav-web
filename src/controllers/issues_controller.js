function IssuesController($scope, $rootScope, searchService, $timeout) {
  this.rs = $rootScope;
  this.scope = $scope;
  this.post;
  this.searchService = searchService;
  this.timeout = $timeout;
  this.issue = {}
};

//  {
// comment:  
// bill_id:  
// article_link:
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
  this.linkAdd = false;
  this.billSearch ? this.billSearch = false : this.billSearch = true;
};

IssuesController.prototype.toggleLink = function() {
  this.billSearch = false;
  this.linkAdd ? this.linkAdd = false : this.linkAdd = true;
};

module.exports = IssuesController
