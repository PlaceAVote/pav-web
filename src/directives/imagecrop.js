var ImageCropper = require('../utils/imagecrop.js');
module.exports = function() {
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
              if (!img_c) {
                scope.crop = false;
                return
              }
              var img = new Image(200,200);
              img.src = img_c.crop('image/jpeg', 1);
              console.log(img.src);
              // console.log(scope.saveImage);
              convertDataURIToBinary(img.src, function(i) {
                scope.saveImage({img: i});
              });
              
              scope.crop = false;          
            }
          });

          var BASE64_MARKER = ';base64,';
          function convertDataURIToBinary(dataURI, callback) {
            var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            var base64 = dataURI.substring(base64Index);
            var raw = window.atob(base64);
            var rawLength = raw.length;
            var array = new Uint8Array(new ArrayBuffer(rawLength));
            for(i = 0; i < rawLength; i++) {
              array[i] = raw.charCodeAt(i);
            }
            return callback(array);
          }

        },
    };
};



