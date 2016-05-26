var d3 = require('d3');
module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      data: '<'
    },
    link: function(scope, el, attr) {
      var dataset = scope.data;
      scope.$watch('data', function(n, o) {
        dataset = n;
      });


      var padding = window.getComputedStyle(el[0].offsetParent, null).getPropertyValue('padding-left');

      padding = parseInt(padding.replace('px', '')) * 2;

      var width = el[0].offsetParent.offsetWidth - padding,
          height = el[0].offsetParent.offsetWidth - padding,
          radius = Math.min(width, height) / 1.5;

      var pie = d3.layout.pie()
          .value(function(d, i) {
            return d.val;
          })

      var arc = d3.svg.arc()
          .innerRadius(radius - 80)
          .outerRadius(radius - 50);

      var svg = d3.select(el[0]).append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var path = svg.selectAll("path")
          .data(pie(dataset))
          .enter().append("path")
          // .attr("fill", function(d, i) { console.log(d, i); })
          .attr('class', function(d, i) {
            console.log(d, i);
            var className = 'c-pie-' + dataset[i].className;
            return className;
          })
          .attr("d", arc);
    },
  };
};
