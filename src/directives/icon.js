module.exports = function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
        icon: '=',
    },
    template: '<svg class="{{icon}}"><use xlink:href=""/></svg>',
    link:function(scope, svg, attrs){
        svg.children().attr('xlink:href', '/img/icons.svg#' + scope.icon);
    }
  };
};
