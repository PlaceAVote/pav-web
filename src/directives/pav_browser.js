module.exports = function($rootScope,$sce) {
  return {
    restrict: 'E',
    scope: {
      source: '=',
    },
    templateUrl: 'partials/directives/pav_browser.html',
    link: function(scope, el, attr) {
      var browser = document.getElementById('pavBrowserFrame');
      scope.$watch(function() {
        return $rootScope.articleLink;
      }, function(o,n) {
        if (n != o) {
          scope.showBrowser = true;
          scope.loading = true;
          scope.article = $sce.trustAsResourceUrl($rootScope.articleLink);
          browser.onload = function(e) {
            if (e.type === 'load') {
              scope.loading = false;
              scope.$apply();
            }
          };
        }
      });

      scope.$watch(function() {
        return $rootScope.browserOpen;
      }, function(o,n) {
        if (n != o & n !== undefined) {
          scope.showBrowser = true;
          scope.loading = true;
          scope.article = $sce.trustAsResourceUrl($rootScope.articleLink);
          browser.onload = function(e) {
            if (e.type === 'load') {
              scope.loading = false;
              scope.$apply();
            }
          };
        }
      });

      scope.openLink = function() {
        window.open(scope.article, '_blank');
      };

      scope.clearFrame = function() {
        scope.showBrowser = false;
        scope.article = $sce.trustAsResourceUrl('<div></div>');
      };
    },
  };
};
