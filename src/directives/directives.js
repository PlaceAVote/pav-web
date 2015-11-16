 angular.module('pavDirectives', []).
  directive('headerNav', function() {
    return {
      restrict: 'E',
      templateUrl: 'partials/header.html'
    };
  })
  .directive('statusChart', function() {
			  	function link(scope, el){


scope.$watch('data', function(newValue, oldValue) {
var vote_for = 0;
var vote_against = 0;
if (newValue)
    console.log(newValue);
      var data = newValue;
	  data.forEach(function(d) {
	        d.created_at = new Date(d.created_at);
	        if (d.vote) {
	        	vote_for++;
	        	d['for'] = vote_for;
	        	d['against'] = vote_against;
	        } else if (!d.vote) {
	        	vote_against++;
	        	d['against'] = vote_against;
	        	d['for'] = vote_for;
	        } 
	    });

	var margin = {top: 30, right: 10, bottom: 20, left: 20},
		per_width = el[0].clientWidth,
	    width = per_width - margin.left - margin.right,
	    height = 270 - margin.top - margin.bottom;

	var svg = d3.select(el[0])
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5)
	    .outerTickSize(0);

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(4)
	    .innerTickSize(-width);

	// Define the line
	var for_line = d3.svg.line()
	    .x(function(d) { return x(d.created_at); })
	    .y(function(d) { return y(d['for']); });

	var against_line = d3.svg.line()
	    .x(function(d) { return x(d.created_at); })
	    .y(function(d) { return y(d['against']); });


	    // Scale the range of the data
	    x.domain(d3.extent(data, function(d) { return d.created_at; }));
	    y.domain([0, d3.max(data, function(d) { return d['for']; })]);



	    // Add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);

	    // Add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis);

	    // Add the valueline path.
	    svg.append("path")
	        .attr("class", "for_line")
	        .attr("d", for_line(data));

	    svg.append("path")
	        .attr("class", "opposed_line")
	        .attr("d", against_line(data));

	    svg.selectAll(".y.axis .tick text")
	    	.attr("x", "-10");

	   	svg.select('.y.axis .tick line')
	   		.attr("class", "baseline");

	d3.select(window).on('resize', resize); 

	function resize() {
		// update width
		width = el[0].clientWidth;
		width = width - margin.left - margin.right;

		// reset x range
		x.range([0, width]);
		
		xAxis = d3.svg.axis().scale(x)
	    		.orient("bottom").ticks(5);

	   	yAxis = d3.svg.axis().scale(y)
	    		.orient("left").ticks(4)
	    		.innerTickSize(-width);


   		 d3.select(svg.node().parentNode)
        .style('width', (width + margin.left + margin.right) + 'px');

        svg.select('.for_line')
			.attr("d", for_line(data));

	  	svg.select('.opposed_line')
			.attr("d", against_line(data));

		svg.select('.x.axis')
		 	.attr("transform", "translate(0," + height + ")")
		 	.call(xAxis);

		svg.select('.y.axis')
		 	.call(yAxis);

	    svg.selectAll(".y.axis .tick text")
	    	.attr("x", "-10");
		            
	}
});
        
	}
  	
return {
	link: link,
	restrict: 'E',
	scope: {data: '='}
};
});
