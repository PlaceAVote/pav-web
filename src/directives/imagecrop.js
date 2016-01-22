var ImageCropper = require('../utils/imagecrop.js');
module.exports = function() {
    return {
        restrict: 'E',
        scope: {
          image: '=',
          crop: '=',
        },
        templateUrl: 'partials/directives/imagecrop.html',
        link: function(scope, el, attr) {
          var dimension = null;
          
          var onUpdateHandler = function (dim) {
            dimensions = dim;
            console.log(dim);
          };

          var options = {
            update: onUpdateHandler,
            max_width: 500,
            max_height: 500,
            min_crop_height: 200,
            min_crop_width: 200,
            fixed_size: true,
            create_cb: function(dim) {
              console.log('created - ', dim);
            },
            destroy_cb: function(dim) {
              console.log('destroyed');
            }
          };
          
          var img_c;
          scope.$watch('image', function(n,o) {
            if (n && !o) {
              img_c = new ImageCropper('#imgCrop', scope.image, options);
            } 
            if (n && o) {
              console.log('new file');
              img_c.destroy();
              img_c = new ImageCropper('#imgCrop', scope.image, options);
            } 

          });

          scope.$watch('crop', function(n, o) {
            if(n) {
              var img = new Image(200,200);
              img.src = img_c.crop('image/jpeg', 1);
              // img.width = 200;
              // img.height = 200;
              // console.log(dimensions.w, dimensions.h);
              console.log(img.src);
              scope.crop = false;              
            }
          });
        },
    };
};
