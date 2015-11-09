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
                if (newValue)
                    console.log(newValue);
            		var parseDate = d3.time.format("%d-%b-%y").parse;
                      var data = newValue;

                	  data.forEach(function(d) {
					        d.created_at = new Date(d.created_at * 1000);
					        d.created_at = parseDate(d.created_at);
					        d.vote = +d.vote;
					    });




					var margin = {top: 30, right: 20, bottom: 30, left: 50},
					    width = 600 - margin.left - margin.right,
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

										// Define the axes
					var xAxis = d3.svg.axis().scale(x)
					    .orient("bottom").ticks(5);

					var yAxis = d3.svg.axis().scale(y)
					    .orient("left").ticks(5);

					// Define the line
					var valueline = d3.svg.line()
					    .x(function(d) { return x(d.created_at); })
					    .y(function(d) { return y(d.vote); });


					    // Scale the range of the data
					    x.domain(d3.extent(data, function(d) { return d.created_at; }));
					    y.domain([0, d3.max(data, function(d) { return d.vote; })]);

					    // Add the valueline path.
					    svg.append("path")
					        .attr("class", "line")
					        .attr("d", valueline(data));

					    // Add the X Axis
					    svg.append("g")
					        .attr("class", "x axis")
					        .attr("transform", "translate(0," + height + ")")
					        .call(xAxis);

					    // Add the Y Axis
					    svg.append("g")
					        .attr("class", "y axis")
					        .call(yAxis);
					            

            });
        
// do {
// 	console.log(scope.data);    
// }
// while (scope.data !== undefined);
			  		// console.log(scope.data);
			  		// if(scope.data !== undefined) {
			  		// var data = scope.data;
			  		// console.log('test');
			  		// console.log(data);



					//   		// Set the dimensions of the canvas / graph


					// // Parse the date / time
					

					// // Set the ranges



					// Adds the svg canvas


					// // Get the data
		

					// });
				}
  	
  	return {
  		link: link,
  		restrict: 'E',
  		scope: {data: '='}
  	};
  });
