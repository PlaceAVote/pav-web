var isArray = require('../utils/is_array.js');

angular.module('pavDirectives', []).
     directive('statusChart', function() {

            var sortBy = (function() {
                     //cached privated objects
                     var _toString = Object.prototype.toString,
                         _parser = function(x) {
                             return x;
                         },
                         _getItem = function(x) {
                             return this.parser((_toString.call(x) === "[object Object]" && x[this.prop]) || x);
                         };
                     return function(array, o) {
                         if (!(array instanceof Array) || !array.length)
                             return [];
                         if (_toString.call(o) !== "[object Object]")
                             o = {};
                         if (typeof o.parser !== "function")
                             o.parser = _parser;
                         //if @o.desc is false: set 1, else -1
                         o.desc = [1, -1][+!!o.desc];
                         return array.sort(function(a, b) {
                             a = _getItem.call(o, a);
                             b = _getItem.call(o, b);
                             return ((a > b) - (b > a)) * o.desc;
                         });
                     };

                 }());



         function link(scope, el) {
            //moved this here so it was in scope.
           //TODO it should be injected in. to do so, you may have
           //to make a service that simply exposes d3.  At least then
           //it can be reused. p.s. if you can think of a better solution
           //do that.
           // console.log(data);
           var d3 = require('d3');
           var counter = 0;
               var margin = {top: 30, right: 10, bottom: 20, left: 30},
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


           scope.$watch('data', function(newValue) {
            counter++;
                     var vote_for = 0,
                     vote_against = 0;
                
                // Define the line
                 var for_line = d3.svg.line()
                     .x(function(d) {
                         return x(d.created_at);
                     })
                     .y(function(d) {
                         return y(d['for']);
                     });

                 var against_line = d3.svg.line()
                     .x(function(d) {
                         return x(d.created_at);
                     })
                     .y(function(d) {
                         return y(d['against']);
                     });


                //This formats new data
                 if (isArray(newValue)) {
                 data = newValue;
                 data.forEach(function(d) {
                     d.created_at = new Date(d.created_at);
                 });

                 sortBy(data, {
                     prop: "created_at"
                 });


                 data.forEach(function(d) {
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
                }
 

                var x = d3.time.scale().domain(d3.extent(data, function(d) {
                     return d.created_at;
                 })).range([0, width]);
                 var y = d3.scale.linear().range([height, 0]);



                   var xAxis = d3.svg.axis().scale(x)
                    .orient("bottom").ticks(5);

                     var yAxis = d3.svg.axis().scale(y)
                    .orient("left").ticks(4)
                     .innerTickSize(-width);


               x.domain(d3.extent(data, function(d) {
                     return d.created_at;
                 }));
                 y.domain([0, d3.max(data, function(d) {
                     return d['for'];
                 })]);


                //this inits the chart with necessary elements.
                 if(counter == 1) {

                var svg = d3.select('svg g');

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

                 } //end of if



               //This animates the graph when new data is pulled in         
                if(counter > 1) {
                  
                    // Scale the range of the data again 
                 x.domain(d3.extent(data, function(d) {
                     return d.created_at;
                 }));
                 y.domain([0, d3.max(data, function(d) {
                     return d['for'];
                 })]);

                // Select the section we want to apply our changes to
                var svg = d3.select(el[0]).transition();

                // Make the changes
                    svg.select(".for_line")   // change the line
                        .duration(750)
                        .attr("d", for_line(data));
                    svg.select(".opposed_line")   // change the line
                        .duration(750)
                        .attr("d", against_line(data));
                    svg.select(".x.axis") // change the x axis
                        .duration(750)
                        .call(xAxis);
                    svg.select(".y.axis") // change the y axis
                        .duration(750)
                        .call(yAxis);

                        d3.select(window).on('resize', resize);
                }            





                //Resize event call
                 d3.select(window).on('resize', resize);

                 function resize() {
                     // update width
                     var svg = d3.select('svg g');
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
                 } //End of Resize Function
           
             });
         }

         return {
             link: link,
             restrict: 'E',

             // bindToController: true,
             scope: {
                 data: '='
             },
            controller: 'BillCtrl',
             controllerAs: 'bill'
         };
     });
