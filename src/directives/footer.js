var PAV = window.PAV || {};
var footerDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/website_partials/footer.html',
  };
};
PAV.footerDirective = footerDirective;
module.exports = footerDirective;
