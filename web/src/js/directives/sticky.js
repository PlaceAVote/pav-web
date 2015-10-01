 angular.module('pavDirectives', []).
  directive('stickyNav', function() {
    return {
      restrict: 'AC',
      link: function(scope, element) {
        var el = element[0].id;
        window.onscroll = function() {
          if(window.pageYOffset > 1) {
              document.getElementById(el).className = 'navscroll';
            } else {
              document.getElementById(el).className = ' ';
            }
        };
      }
    };
  });
