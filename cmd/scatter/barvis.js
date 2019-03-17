function createVis() {
  d3.csv("mondial/economy.csv", d => {
	if (
		logX && Number(d[scatterX]) <=0 
	    ){
	  return undefined
	}
    return d
  })
  .then(data => {overallVis(data)}) // v5        
function overallVis(incomingData) {
  var maxX = d3.max(incomingData, d => Number(d[scatterX]))
  var minX = d3.min(incomingData, d => Number(d[scatterX]))
  var barWidth = width / incomingData.length 
  var xScale = (logX) ? d3.scaleLog().domain([minX,maxX]).range([20,480]) :  d3.scaleLinear().domain([minX,maxX]).range([20,480]) 
  var axisScale = (logX) ? d3.scaleLog().domain([minX,maxX]).range([480,20]) :  d3.scaleLinear().domain([minX,maxX]).range([480,20]) 
  var cScale = d3.scaleQuantize().domain([minX, maxX]).range(colorbrewer.Set2[4]);
 
  
  d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")      
  var countries = d3.selectAll("g.overallG");                            
  countries
    .append("rect")
    .attr("x", (d,i) => i * barWidth)  
    .attr("y", d => 480 - xScale(d[scatterX]))
    .attr("height", d => xScale(d[scatterX]))
    .attr("width", barWidth)    
    .style("fill", d => cScale(d[scatterX]))
    .style("stroke","black")
    .style("stroke-opacity",0.25)


     axis = d3.axisRight().scale(axisScale).ticks(8,".1f")
 	 d3.select("svg").append("g").attr("id","axis")
 	 
 	 .call(axis)
 	 .append("text")
 	 .attr("x","250")
 	 .attr("y",480 + 10)
 	 //.attr("transform", "rotate(-90)")
 	 .text(scatterX)
 	 
    }
}

