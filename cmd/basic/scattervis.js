function createVis() {
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

