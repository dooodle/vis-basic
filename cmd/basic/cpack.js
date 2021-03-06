function createVis() {
    var diameter = 1200,
        format = d3.format(",d");

    var pack = d3.layout.pack()
        .size([diameter - 4, diameter - 4])
        .children(function(d) {
            return d.values;
        })
        .value(function(d) {
            return d.values;
        });

    var svg = d3.select("body").append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(2,2)");

    d3.csv("mondial/"+ relation + ".csv", function(error, data) {

        var toplevel = d3.nest()
            .key(function(d) {
                return d[one];
            })
            .key(function(d) {
                return d[many];
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(data);

	var topRoot = {
            key: "root",
            values: toplevel
        };

        var node = svg.datum(topRoot).selectAll(".node")
            .data(pack.nodes)
            .enter().append("g")
            .attr("class", function(d) {
                return d.children ? "node" : "leaf node";
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            });

        node.append("text")
            .attr("x",0)
            .attr("y",0)
            .append("tspan")
            .attr("x",0)
            .attr("dy",0)
            .text( function(d) {
                console.log(d)
                if (d.key == "root") {
                    return ""
                }
                return d.parent.key
            })
            .append("tspan")
            .attr("x",0)
            .attr("dy", "1em")
            .text( function(d) {
                return d.key
            })
        ;
    });
}



