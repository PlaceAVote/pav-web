var ImageCropper = require('../utils/imagecrop.js');
var imageCropDirective = function() {
  return {
    restrict: 'E',
    scope: {
      image: '=',
      crop: '=',
      saveImage: '&',
    },
    templateUrl: 'partials/directives/imagecrop.html',
    link: function(scope, el, attr) {
      var dimension = null;
      var onUpdateHandler = function(dim) {
        dimensions = dim;
      };

      var options = {
        update: onUpdateHandler,
        max_width: 400,
        max_height: 400,
        min_crop_height: 200,
        min_crop_width: 200,
        fixed_size: true,
      };
      var img_c;
      scope.$watch('image', function(n,o) {
        if (n && !o) {
          img_c = new ImageCropper('#imgCrop', scope.image, options);
        }
        if (n && o) {
          img_c.destroy();
          img_c = new ImageCropper('#imgCrop', scope.image, options);
        }

      });

      scope.$watch('crop', function(n, o) {
        if (n) {
          if (!img_c) {
            scope.crop = false;
            return;
          }
          var img = new Image(200,200);
          img.src = img_c.crop('image/jpeg', 1);
          scope.saveImage({img: img.src});
          scope.crop = false;
        }
      });
    },
  };
};
module.exports = imageCropDirective;
