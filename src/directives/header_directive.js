module.exports = function($scope) {
  return {
    restrict: 'E',
    link: function(scope, elem, attrs, controller) {
      console.log(scope);
    },
    templateUrl: 'partials/header.html',
  };
};
