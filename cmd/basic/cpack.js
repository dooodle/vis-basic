// //based on example from https://observablehq.com/@d3/circle-packing
// function createVis() {
//     chart = {
//         root = pack(data)

//         svg = d3.create("svg")
//               .attr("viewBox", [0, 0, width, height])
//               .style("font", "10px sans-serif")
//               .attr("text-anchor", "middle")

//         const shadow = DOM.uid("shadow");

//         svg.append("filter")
//             .attr("id", shadow.id)
//             .append("feDropShadow")
//             .attr("flood-opacity", 0.3)
//             .attr("dx", 0)
//             .attr("dy", 1);

//         const node = svg.selectAll("g")
//               .data(d3.nest().key(d => d.height).entries(root.descendants()))
//               .join("g")
//               .attr("filter", shadow)
//               .selectAll("g")
//               .data(d => d.values)
//               .join("g")
//               .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

//         node.append("circle")
//             .attr("r", d => d.r)
//             .attr("fill", d => color(d.height));

//         const leaf = node.filter(d => !d.children);

//         leaf.select("circle")
//             .attr("id", d => (d.leafUid = DOM.uid("leaf")).id);

//         leaf.append("clipPath")
//             .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
//             .append("use")
//             .attr("xlink:href", d => d.leafUid.href);

//         leaf.append("text")
//             .attr("clip-path", d => d.clipUid)
//             .selectAll("tspan")
//             .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
//             .join("tspan")
//             .attr("x", 0)
//             .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
//             .text(d => d);

//         node.append("title")
//             .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

//         return svg.node();
//     }

//     data = d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json")
//     pack = data => d3.pack()
//         .size([width - 2, height - 2])
//         .padding(3)
//     (d3.hierarchy(data)
//      .sum(d => d.value)
//      .sort((a, b) => b.value - a.value))

//     width = 975
//     height = 975
//     format = d3.format(",d")
//     color = d3.scaleSequential([8, 0], d3.interpolateMagma)

// }

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

    //Get data
    d3.csv("mondial/airport.csv", function(error, data) {

        var toplevel = d3.nest()
            .key(function(d) {
                return d["city"];
            })
            .key(function(d) {
                return d["iata_code"];
            })
            .rollup(function(leaves) {
                return leaves.length;
            })
            .entries(data);

	var countryRoot = {
            key: "root",
            values: toplevel
        };

        var node = svg.datum(countryRoot).selectAll(".node")
            .data(pack.nodes)
            .enter().append("g")
            .attr("class", function(d) {
                return d.children ? "node" : "leaf node";
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function(d) {
                return d.name + (d.children ? "" : ": " + format(d.size));
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


function createVisLine( ) {
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

// var diameter = 460,
//     format = d3.format(",d");

// var pack = d3.layout.pack()
//     .size([diameter - 4, diameter - 4])
//     .children(function(d) {
//         return d.values;
//     })
//     .value(function(d) {
//         return d.values;
//     });

// var svg = d3.select("body").append("svg")
//     .attr("width", diameter)
//     .attr("height", diameter)
//     .append("g")
//     .attr("transform", "translate(2,2)");

// //Get data
// d3.csv("mondial/airport.csv", function(error, data) {

//     var tops = d3.nest()
//         .key(function(d) {
//             return d["city"];
//         })
//         .key(function(d) {
//             return d["iata_code"];
//         })
//         .rollup(function(leaves) {
//             return leaves.length;
//         })
//         .entries(data);

//     var countryRoot = {
//         key: "root",
//         values: tops
//     };

//     var node = svg.datum(countryRoot).selectAll(".node")
//         .data(pack.nodes)
//         .enter().append("g")
//         .attr("class", function(d) {
//             return d.children ? "node" : "leaf node";
//         })
//         .attr("transform", function(d) {
//             return "translate(" + d.x + "," + d.y + ")";
//         });

//     node.append("title")
//         .text(function(d) {
//             console.log(d)
//             return d.Country + (d.children ? "" : ": " + format(d.size));
//         });

//     node.append("circle")
//         .attr("r", function(d) {
//             return d.r;
//         });

//     node.append("text")
//         .attr("x",0)
//         .attr("y",0)
//         .text(function(d) {
//             return d.Country;
//         });


// });

