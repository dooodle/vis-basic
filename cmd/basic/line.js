//based on https://codepen.io/zakariachowdhury/pen/JEmjwq
//MIT License

//NB the majority of the code is based on the MIT Licensed
//example code, with some changes to allow the rendering
//of a matched image.
function createVis( ) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var lineOpacity = "0.25";
    var lineOpacityHover = "0.85";
    var otherLinesOpacityHover = "0.1";
    var lineStroke = "1.5px";
    var lineStrokeHover = "2.5px";
    var duration = 250;
    var circleOpacity = '0.85';
    var circleOpacityOnLineHover = "0.25"
    var circleRadius = 3;
    var circleRadiusHover = 6;
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("mondial/" + relation +".csv", function(data) {        
        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d[strong];})
            .entries(data);

        var res = sumstat.map(function(d){ return d.key }) // list of group names

        //Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d[weak]; }))
            .range([ 0, width ]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.format("d")).ticks(5));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d[n]; })])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format("d")));

        // color palette
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var line = d3.line()
            .x(d => x(d[weak]))
            .y(d => y(d[strong]));

        let lines = svg.append('g')
            .attr('class', 'lines');

        lines.selectAll('.line-group')
            .data(sumstat).enter()
            .append('g')
            .attr('class', 'line-group')  
            .on("mouseover", function(d, i) {
                svg.append("text")
                    .attr("class", "title-text")
                    .style("fill", color(i))        
                    .text(d.name)
                    .attr("text-anchor", "middle")
                    .attr("x", (width-margin)/2)
                    .attr("y", 5);
            })
            .on("mouseout", function(d) {
                svg.select(".title-text").remove();
            })
            .append('path')
            .attr('class', 'line')  
            .attr('d', function(d){
                return d3.line()
                    .x(function(d) { return x(d[weak]); })
                    .y(function(d) { return y(+d[n]); })
                (d.values)
            })
            .style('stroke', (d, i) => color(i))
            .style('opacity', lineOpacity)
            .on("mouseover", function(d) {
                d3.selectAll('.line')
		    .style('opacity', otherLinesOpacityHover);
                d3.selectAll('.circle')
		    .style('opacity', circleOpacityOnLineHover);
                d3.select(this)
                    .style('opacity', lineOpacityHover)
                    .style("stroke-width", lineStrokeHover)
                    .style("cursor", "pointer");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".line")
		    .style('opacity', lineOpacity);
                d3.selectAll('.circle')
		    .style('opacity', circleOpacity);
                d3.select(this)
                    .style("stroke-width", lineStroke)
                    .style("cursor", "none");
            });


        
        lines.selectAll("circle-group")
            .data(sumstat).enter()
            .append("g")
            .style("fill", (d, i) => color(i))
            .selectAll("circle")
            .data(d => d.values).enter()
            .append("g")
            .attr("class", "circle")  
            .on("mouseover", function(d) {
                d3.select(this)     
                    .style("cursor", "pointer")
                    .append("text")
                    .attr("class", "text")
                    .text(`${d[strong]}`)
                    .attr("x", d => x(d[weak]) + 5)
                    .attr("y", d => y(d[n]) - 10);
            })
            .on("mouseout", function(d) {
                d3.select(this)
                    .style("cursor", "none")  
                    .transition()
                    .duration(duration)
                    .selectAll(".text").remove();
            })
            .append("circle")
            .attr("cx", d => x(d[weak]))
            .attr("cy", d => y(d[n]))
            .attr("r", circleRadius)
            .style('opacity', circleOpacity)
            .on("mouseover", function(d) {
                d3.select(this)
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadiusHover);
            })
            .on("mouseout", function(d) {
                d3.select(this) 
                    .transition()
                    .duration(duration)
                    .attr("r", circleRadius);  
            });  
    })
}
