function createSoccerViz() {
  d3.csv("mondial/country.csv").then(data => {overallTeamViz(data)}) // v5
  //d3.csv("worldcup.csv", data => {overallTeamViz(data)}) v4            
function overallTeamViz(incomingData) {
  d3.select("svg")
    .append("g")                                                         
    .attr("id", "teamsG")
    .attr("transform", "translate(50,300)")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "overallG")
    .attr("transform", (d, i) =>"translate(" + (i * 50) + ", 0)")        
  var teamG = d3.selectAll("g.overallG");                            
  teamG
    .append("circle")
    .attr("r", 20)
   teamG
    .append("text")
    .attr("y", 30)
    .text(d => d.country)
    }
}