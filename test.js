<script>
        // Set the dimensions of the canvas / graph
        var margin = {
                top: 30,
                right: 20,
                bottom: 70,
                left: 50
            },
            width = 1100,
            height = 600;
        // Parse the date / time
        var parseDate = d3.time.format("%Y").parse;
        // Set the ranges
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
var yScale = d3.scaleLinear()
            .domain([0, 1000]) // input 
            .range([height, 0]);
var xScale = d3.scaleLinear()
            .domain([1995, 2017]) // input
            .range([0, width]);
        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient("bottom").ticks(5);
        var yAxis = d3.svg.axis().scale(y)
            .orient("left").ticks(5);
        // Define the line
        var priceline = d3.svg.line()
            .x(function(d) {
                return x(d.Year);
            })
            .y(function(d) {
                return y(d.Value);
            });

        // Adds the svg canvas
        var svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        // Get the data
        d3.csv("FinalData.csv", function(error, data) {
            data.forEach(function(d) {
                d.Year = parseDate(d.Year);
                d.Value = +d.Value;
            });
            // Scale the range of the data
            x.domain(d3.extent(data, function(d) {
                return d.Year;
            }));
            y.domain([0, d3.max(data, function(d) {
                return d.Value;
            })]);
            // Nest the entries by symbol
            var dataNest = d3.nest()
                .key(function(d) {
                    return d.State;
                })
                .entries(data);
            var color = d3.scale.category10(); // set the colour scale
            
            legendSpace = width / dataNest.length; // spacing for the legend
            // Loop through each symbol / key
            dataNest.forEach(function(d, i) {
                svg.append("path")
                    .attr("class", "line")
                    .style("stroke", function() { // Add the colours dynamically
                        return d.color = color(d.key);
                    })
                    .attr("id", 'tag' + d.key.replace(/\s+/g, '')) // assign ID
                    .attr("d", priceline(d.values));
                // Add the Legend
                svg.append("text")
                    .attr("x", (legendSpace / 2) + i * legendSpace) // space legend
                    .attr("y", height + (margin.bottom / 2) + 5)
                    .attr("class", "legend") // style the legend
                    .style("fill", function() { // Add the colours dynamically
                        return d.color = color(d.key);
                    })
                    .on("click", function() {
                        // Determine if current line is visible 
                        var active = d.active ? false : true,
                            newOpacity = active ? 0 : 1;
                        // Hide or show the elements based on the ID
                        d3.select("#tag" + d.key.replace(/\s+/g, ''))
                            .transition().duration(100)
                            .style("opacity", newOpacity);
                        // Update whether or not the elements are active
                        d.active = active;
                    })
                    .text(d.key);
            });
            // Add the X Axis
            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
            // Add the Y Axis
            svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale));
        });

    </script>