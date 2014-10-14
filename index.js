var d3 = require('d3');
var Plottable = require('./plottable/plottable.js').node_plottable;
var globals = {};
var window = global.window = d3.select('*')[0][0]._ownerDocument._parentWindow;
var document = global.document = window.document;

if ('window' in global) globals.window = global.window;
global.window = window;
if ('document' in global) globals.document = global.document;
global.document = document;

//fixes for plottable
global.navigator = {};
global.navigator.userAgent = 'WebKit';
global.chartSettings = {
    CHART_WIDTH: 750,
    CHART_HEIGHT: 500
}


Plottable.Axis.AbstractAxis.prototype._hideEndTickLabels = function () {
    /*var _this = this;
     var boundingBox = this._element.select('.bounding-box')[0][0].getBoundingClientRect();
     var isInsideBBox = function (tickBox) {
     return (Math.floor(boundingBox.left) <= Math.ceil(tickBox.left) && Math.floor(boundingBox.top) <= Math.ceil(tickBox.top) && Math.floor(tickBox.right) <= Math.ceil(boundingBox.left + _this.width()) && Math.floor(tickBox.bottom) <= Math.ceil(boundingBox.top + _this.height()));
     };
     var tickLabels = this._tickLabelContainer.selectAll('.' + AbstractAxis.TICK_LABEL_CLASS);
     if (tickLabels[0].length === 0) {
     return;
     }
     var firstTickLabel = tickLabels[0][0];
     if (!isInsideBBox(firstTickLabel.getBoundingClientRect())) {
     d3.select(firstTickLabel).style('visibility', 'hidden');
     }
     var lastTickLabel = tickLabels[0][tickLabels[0].length - 1];
     if (!isInsideBBox(lastTickLabel.getBoundingClientRect())) {
     d3.select(lastTickLabel).style('visibility', 'hidden');
     }*/
};
Plottable.Axis.AbstractAxis.prototype._hideOverlappingTickLabels = function () {
    /*var visibleTickLabels = this._tickLabelContainer.selectAll('.' + AbstractAxis.TICK_LABEL_CLASS).filter(function (d, i) {
     return d3.select(this).style('visibility') === 'visible';
     });
     var lastLabelClientRect;
     visibleTickLabels.each(function (d) {
     var clientRect = this.getBoundingClientRect();
     var tickLabel = d3.select(this);
     if (lastLabelClientRect != null && Plottable._Util.DOM.boxesOverlap(clientRect, lastLabelClientRect)) {
     tickLabel.style('visibility', 'hidden');
     }
     else {
     lastLabelClientRect = clientRect;
     tickLabel.style('visibility', 'visible');
     }
     });*/
};

function getParsedStyleValue(style, prop) {
    var value = style.getPropertyValue(prop);
    var parsedValue = parseFloat(value);
    if (parsedValue !== parsedValue) {
        return 0;
    }
    return parsedValue;
}

Plottable._Util.DOM.getElementWidth = function (elem) {
    var style = window.getComputedStyle(elem);
    var width = getParsedStyleValue(style, "width")
        + getParsedStyleValue(style, "padding-left")
        + getParsedStyleValue(style, "padding-right")
        + getParsedStyleValue(style, "border-left-width")
        + getParsedStyleValue(style, "border-right-width");
    return width > 0 ? width : chartSettings.CHART_WIDTH;
};

Plottable._Util.DOM.getElementHeight = function (elem) {
    var style = window.getComputedStyle(elem);
    var height = getParsedStyleValue(style, "height")
        + getParsedStyleValue(style, "padding-top")
        + getParsedStyleValue(style, "padding-bottom")
        + getParsedStyleValue(style, "border-top-width")
        + getParsedStyleValue(style, "border-bottom-width");
    return height > 0 ? height : chartSettings.CHART_HEIGHT;
};

// that's it

module.exports = Plottable;

//----------------------------example

var svg = d3.select('body').append('svg').attr('id', 'testSVG').attr('width', 500).attr('height', 500);

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
//
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

new Plottable.Component.Table([
    [null, null, legend, null, null],
    [null, yAxis, lines.merge(plots), yAxis2, null],
    [null, null, xAxis, null, null]
])
    .renderTo('svg#testSVG');


console.log(d3.select('body')[0][0].innerHTML);

//----------------------------

if ('window' in globals) global.window = globals.window;
else delete global.window;
if ('document' in globals) global.document = globals.document;
else delete global.document;
delete global.navigator;
delete global.chartSettings;
