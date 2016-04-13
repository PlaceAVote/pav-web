var objectFitImages = require('object-fit-images');

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      img: '=',
      class: '@',
    },
    templateUrl: 'partials/directives/image_smart.html',
    link: function(scope, el, attr) {


      scope.$watch('img', function(n, o) {

        if (n) {

          var image = new Image();

          image.onload = function() {
            el[0].appendChild(image);
            scope.loading = false;
            scope.$apply();
            objectFitImages('ie_object_fit-shim');
          };

          scope.loading = true;
          image.className = scope.class;
          image.className += ' ie_object_fit-shim';
          image.src = scope.img;
        }

      });
    },
  };
};
