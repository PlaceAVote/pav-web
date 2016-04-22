function initPreloaderCtrl($scope, $rootScope) {
  console.log($scope, $rootScope);
  this.scope = $scope;
  this.rootScope = $rootScope;

  scope.$watch(this.rootScope.user, function(o, n) {
    console.log(o, n);
  });
};

module.exports = initPreloaderCtrl;
