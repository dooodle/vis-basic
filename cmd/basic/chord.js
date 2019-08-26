//based on tutorial at https://www.delimited.io/blog/2013/12/8/chord-diagrams-in-d3
//https://github.com/sghall/d3-chord-diagrams
//MIT License
function createVis() {
    console.log("calling chord create")
    console.log("relation",relation)
    console.log("left",left)
    console.log("right",right)
    console.log("n",n)
    d3.csv("mondial/"+ relation + ".csv", function(error, data) {
        var mpr = chordMpr(data);
        mpr
            .addValuesToMap(left)
            .setFilter(function (row, a, b) {
                return (row[left] === a.name && row[right] === b.name)
            })
            .setAccessor(function (recs, a, b) {
                if (!recs[0]) return 0;
                return +recs[0][n];
            });
        drawChords(mpr.getMatrix(), mpr.getMap());
    });
}

