module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      icon: '<',
    },
    template: '<svg class="{{icon}}"><use xlink:href=""/></svg>',
    link: function(scope, svg, attrs) {
      console.log(scope, svg, attrs);
      svg.children().attr('xlink:href', '/img/symbol/svg/sprite.symbol.svg#' + attrs.icon);
    },
  };
};
