//based on example at https://www.d3-graph-gallery.com/graph/line_several_group.html
//<script>
function createVis( ) {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    //    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {
    //    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {
    d3.csv("mondial/" + relation +".csv", function(data) {        
        // group the data: I want to draw one line per group
        var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
            .key(function(d) { return d[strong];})
            .entries(data);

        // Add X axis --> it is a date format
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
        var res = sumstat.map(function(d){ return d.key }) // list of group names
        var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        // Draw the line
        svg.selectAll(".line")
            .data(sumstat)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d.key) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return d3.line()
                    .x(function(d) { return x(d[weak]); })
                    .y(function(d) { return y(+d[n]); })
                (d.values)
            })

            .append("text")
	    .attr("transform", "translate(" + (width+3) + "," + height + ")")
	    .attr("dy", ".35em")
	    .attr("text-anchor", "start")
	    .style("fill", "steelblue")
	    .text("Close");
        
    })

}






function createVisOld() {
    d3.csv("mondial/" + relation +".csv", d => {
	if (
	    logX && Number(d[scatterX]) <=0 || 
	        logY && Number(d[scatterY]) <=0 
	){
	    return undefined
	}
        return d
    })
        .then(data => {overallVis(data)}) // v5        
    function overallVis(incomingData) {
        var maxX = d3.max(incomingData, d => Number(d[scatterX]))
        var minX = d3.min(incomingData, d => Number(d[scatterX]))
        var maxY = d3.max(incomingData, d => Number(d[scatterY]))
        var minY = d3.min(incomingData, d => Number(d[scatterY])) 
        var yScale = (logY) ? d3.scaleLog().domain([minY,maxY]).range([460,0]) : d3.scaleLinear().domain([minY,maxY]).range([460,0])
        var xScale = (logX) ? d3.scaleLog().domain([minX,maxX]).range([20,480]) :  d3.scaleLinear().domain([minX,maxX]).range([20,480]) 
        
        var cScale
        if (scatterC) {
  	    var maxC = d3.max(incomingData, d => Number(d[scatterC]))
  	    var minC = d3.min(incomingData, d => Number(d[scatterC]))	
  	    cScale = d3.scaleQuantize().domain([minC, maxC]).range(colorbrewer.Set2[4]);
        }
        
        d3.select("svg")
            .selectAll("g")
            .data(incomingData)
            .enter()
            .append("g")
            .attr("class", "overallG")      
        var countries = d3.selectAll("g.overallG");                            
        countries
            .append("circle")
            .attr("r", 2)
            .attr("cx", d => xScale(d[scatterX]))
            .attr("cy", d => yScale(d[scatterY]))
        
        if (label) {	
            countries
                .append("text")
                .attr("x", d => xScale(d[scatterX]))
                .attr("y", d => yScale(d[scatterY]))
                .text(d => d[label])
 	}
	if (scatterC) {
	    var countries = d3.selectAll("g.overallG circle");                            
  	    countries.attr("fill", d => cScale(d[scatterC]))
  	    
            var legend = d3.legendColor()
  	        .labelFormat(d3.format(".2f"))
  	        .labelOffset(60) // this number should be determined based on length of label text
  	        .title(scatterC)
  	        .scale(cScale)
  	    ;

	    d3.select("svg")
	        .append("g")
	        .attr("class","legend")
	        .attr("transform", "translate(550,350)")
	        .call(legend);
	}

        xAxis = d3.axisBottom().scale(xScale).ticks(8,".1f")
 	d3.select("svg").append("g").attr("id","xAxis")
 	    .attr("transform", "translate(0,460)")
 	    .call(xAxis)
 	    .append("text")
 	    .attr("x","250")
 	    .attr("y","10")
            .attr("transform","translate(0,50)")        
 	    .text(scatterX)
 	
        yAxis = d3.axisRight()
            .scale(yScale)
            .ticks(8,".1f")
            .tickPadding("10")
 	d3.select("svg").append("g").attr("id","yAxis")
 	    .attr("transform", "translate(480,0)") 
 	    .call(yAxis)   
 	    .append("text")
 	    .attr("transform", "rotate(90,-100,110) translate(0,-50)")
 	    .text(scatterY)	 
    }
}

