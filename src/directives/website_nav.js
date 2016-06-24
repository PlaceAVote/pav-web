var PAV = window.PAV || {};
var websiteNavDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'MenuCtrl',
    link: function(scope, attr, element, controller) {
      window.onscroll = function() {
        if (window.pageYOffset > 1) {
          controller.stickyNav = true;
          scope.$apply();
        } else {
          controller.stickyNav = false;
          scope.$apply();
        }
      };
    },
    templateUrl: 'partials/website_partials/website_nav.html',
  };
};
PAV.websiteNavDirective = websiteNavDirective;
module.exports = websiteNavDirective;
