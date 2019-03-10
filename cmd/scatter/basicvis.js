function createVis() {
  d3.csv("mondial/economy.csv").then(data => {overallVis(data)}) // v5         
function overallVis(incomingData) {
  var maxInflation = d3.max(incomingData, d => d.inflation)
  var minInflation = d3.min(incomingData, d => d.inflation)
  var maxUnemployment = d3.max(incomingData, d => d.unemployment)
  
  var yScale = d3.scaleLinear().domain([0,maxUnemployment]).range([460,0])
  var xScale = d3.scaleLinear().domain([minInflation,maxInflation]).range([20,480]) 
  
  d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")      
  var countries = d3.selectAll("g.overallG");                            
  countries
    .append("circle")
    .attr("r", 1)
    .attr("cx", d => xScale(d.inflation))
    .attr("cy", d => yScale(d.unemployment))
   countries
    .append("text")
    .attr("x", d => xScale(d.inflation))
    .attr("y", d => yScale(d.unemployment))
    //.text(d => d.country)
    
     xAxis = d3.axisBottom().scale(xScale).ticks(4)
 	 d3.select("svg").append("g").attr("id","xAxis")
 	 .attr("transform", "translate(0,480)")
 	 .call(xAxis)
 	 .append("text")
 	 .attr("x","250")
 	 .attr("y","10")
 	 .text("inflation")
 	 
     yAxis = d3.axisRight().scale(yScale).ticks(4)
 	 d3.select("svg").append("g").attr("id","yAxis")
 	 .attr("transform", "translate(480,0)") 
 	 .call(yAxis)   
 	 .append("text")
 	 .attr("transform", "rotate(90,-100,110)") 
 	 .text("unemployment")	 
    }
}

