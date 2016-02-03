function IssuesController($scope, $rootScope, searchService, $timeout) {
  this.rs = $rootScope;
  this.post;
  this.searchService = searchService;
  this.timeout = $timeout;
};

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
module.exports = IssuesController
