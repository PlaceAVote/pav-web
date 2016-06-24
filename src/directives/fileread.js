var PAV = window.PAV || {};
var fileReadDirective = function() {
  return {
    restrict: 'A',
    scope: {
      fileread: '=',
    },
    link: function(scope, element, attributes) {
      element.bind('change', function(changeEvent) {
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          scope.$apply(function() {
            scope.fileread = loadEvent.target.result;
          });
        };
        reader.readAsDataURL(changeEvent.target.files[0]);
      });
    },
  };
};

PAV.fileReadDirective = fileReadDirective;
module.exports = fileReadDirective;
