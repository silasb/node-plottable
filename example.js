var chartConfig = {
    width: 750,
    height: 500,
    ticks: 10
}
var Plottable = require('./index')(chartConfig);

var getExample = function () {
    var data = [
        {x: 1, y: 81, i: 1},
        {x: 2, y: 152, i: 1},
        {x: 3, y: 165, i: 1},
        {x: 4, y: 170, i: 1},
        {x: 5, y: 183, i: 1},
        {x: 6, y: 193, i: 1},
        {x: 7, y: 198, i: 1},
        {x: 8, y: 246, i: 1}
    ];

    var data2 = [
        {x: 1, y: 582, i: 2},
        {x: 2, y: 600, i: 2},
        {x: 3, y: 612, i: 2},
        {x: 4, y: 630, i: 2},
        {x: 5, y: 641, i: 2},
        {x: 6, y: 660, i: 2},
        {x: 7, y: 700, i: 2},
        {x: 8, y: 715, i: 2}
    ];

    var xScale = new Plottable.Scale.Ordinal();
    var xScale2 = new Plottable.Scale.Ordinal();
    var yScale = new Plottable.Scale.Linear();
    var yScale2 = new Plottable.Scale.Linear();
    var colorScale = new Plottable.Scale.Color('Category10');

    var legend = new Plottable.Component.HorizontalLegend(colorScale);
    var xAxis = new Plottable.Axis.Category(xScale, 'bottom');
    var yAxis = new Plottable.Axis.Numeric(yScale, 'left');
    var yAxis2 = new Plottable.Axis.Numeric(yScale2, 'right');
    var lines = new Plottable.Component.Gridlines(null, yScale);

    var plot = new Plottable.Plot.VerticalBar(xScale, yScale)
        .addDataset(data)
        .project('x', 'x', xScale)
        .project('y', 'y', yScale)
        .project('fill', function (d) {
            return 'Series #' + d.i;
        }, colorScale);

    var plot2 = new Plottable.Plot.Line(xScale, yScale2)
        .addDataset(data2)
        .project('x', 'x', xScale2.rangeType('points', 0.9, 0))
        .project('y', 'y', yScale2)
        .project('stroke', function (d) {
            return 'Series #' + d.i;
        }, colorScale);

    var plots = new Plottable.Component.Group([plot, plot2]);

    var result = new Plottable.Component.Table([
        [null, null, legend, null, null],
        [null, yAxis, lines.merge(plots), yAxis2, null],
        [null, null, xAxis, null, null]
    ]).renderString();
    return result;
}

exports.getExample = getExample;

if (require.main === module) {
    console.log(getExample());
}
