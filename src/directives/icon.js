var PAV = window.PAV || {};
var iconDirective = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      icon: '<',
    },
    template: '<svg class="{{class}}"><use xlink:href=""/></svg>',
    link: function(scope, svg, attrs) {
      scope.class = attrs.icon;
      svg.children().attr('xlink:href', '/img/symbol/svg/sprite.symbol.svg#' + attrs.icon);
    },
  };
};
PAV.iconDirective = iconDirective;
module.exports = iconDirective;
