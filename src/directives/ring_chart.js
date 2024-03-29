var d3 = require('d3');

function createChart(dataset, el, attr, window) {

  if (el[0].offsetParent === null) {
    return;
  }

  var padding = window.getComputedStyle(el[0].offsetParent, null).getPropertyValue('padding-left');
  padding = parseInt(padding.replace('px', '')) * 2;

  var width = el[0].offsetParent.offsetWidth - padding;
  var height = el[0].offsetParent.offsetWidth - padding;
  var radius = Math.min(width, height) / 1.5;
  var chartId = 'chartId_' + Math.floor((Math.random() * 1000)).toString();


  if (height > 300 || width > 300) {
    height = 260;
    width = 260;
    radius = Math.min(width, height) / 1.5;
  }

  var pie = d3.layout.pie()
    .value(function(d, i) {
      return d.val;
    });

  var arc = d3.svg.arc()
    .innerRadius(radius - 80)
    .outerRadius(radius - 50);

  var svg = d3.select(el[0]).append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', chartId)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  var path = svg.selectAll('path')
    .data(pie(dataset))
    .enter().append('path')
    .attr('class', function(d, i) {
      var className = 'c-pie-' + dataset[i].className;
      return className;
    })
    .attr('d', arc);


  dataset.sort(function(a, b) {
    return b.val - a.val;
  });

  svg.append('text')
    .attr('text-anchor', 'middle')
    .append('tspan')
    .attr('x', 0)
    .attr('dy', -2)
    .attr('fill', '#676767')
    .attr('font-weight', 'bold')
    .attr('font-size', '22px')
    .text(dataset[0].val + '%')
    .append('tspan')
    .attr('x', 0)
    .attr('dy', 20)
    .attr('font-size', '14px')
    .text(dataset[0].label);

  d3.select(window).on('resize', function() {
    d3.select('#' + chartId).remove();
    createChart(dataset, el, attr, window);
  });
}

function updateChart(dataset, el, attr) {

  // Nothing to do.
}

var ringChartDirective = function($window) {
  return {
    restrict: 'E',
    scope: {
      data: '<',
    },
    link: function(scope, el, attr) {
      var dataset = scope.data;
      scope.$watch('data', function(n, o) {
        // Update if the new and old values are not the same.
        if (n !== o) {
          scope.updateChart(n, el, attr);
        }
      });
      scope.updateChart = updateChart;
      scope.createChart = createChart;
      // Inisitalise chart with values.
      scope.createChart(dataset, el, attr, $window);
    },
  };
};
module.exports = ringChartDirective;
