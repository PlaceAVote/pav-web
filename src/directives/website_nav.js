module.exports = function() {
    return {
      restrict: 'E',
      replace: true,
      link: function(scope, element) {
        var el = element[0].id;
        console.log(el);
        window.onscroll = function() {
          console.log(el);
          if(window.pageYOffset > 1) {
             if (el == 'webNav') {document.getElementById(el).className = 'navscroll';}
              // document.getElementById(el).className = 'navscroll';
            } else {
              if (el == 'webNav') {document.getElementById(el).className = ' ';}
              // el == 'webNav' ? document.getElementById(el).className = ' ': return;
              // document.getElementById(el).className = ' ';
            }
        };
      },
       templateUrl: 'partials/website_partials/website_nav.html'
    };
};

