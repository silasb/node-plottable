var path = require('path');
var fs = require('fs');
var juice = require('juice');
var window = d3.select('*')[0][0]._ownerDocument._parentWindow;
var document = window.document;
var navigator = {};
navigator.userAgent = 'WebKit';

var Plottable = require('plottable.js')(window, document, navigator);

var chartWidth = 750;
var chartHeight = 500;
var tickCount = 10;
var PLOTTABLE_CSS_PATH = path.join(__dirname, 'node_modules', 'plottable.js', 'plottable.css');
var plottableCss = fs.readFileSync(PLOTTABLE_CSS_PATH, {encoding: 'utf8'});

//function will add inline styles to svg chart
Plottable.inlineStyle = function (svg) {
    return juice.inlineContent(svg, plottableCss);
}

function getParsedStyleValue(style, prop) {
    var value = style.getPropertyValue(prop);
    var parsedValue = parseFloat(value);
    if (parsedValue !== parsedValue) {
        return 0;
    }
    return parsedValue;
}

//override chart width, Plottable function returns always 0 in node so we have to change it
Plottable._Util.DOM.getElementWidth = function (elem) {
    var style = window.getComputedStyle(elem);
    var width = getParsedStyleValue(style, 'width') +
        getParsedStyleValue(style, 'padding-left') +
        getParsedStyleValue(style, 'padding-right') +
        getParsedStyleValue(style, 'border-left-width') +
        getParsedStyleValue(style, 'border-right-width');

    return width > 0 ? width : chartWidth;
};

//override chart height
Plottable._Util.DOM.getElementHeight = function (elem) {
    var style = window.getComputedStyle(elem);
    var height = getParsedStyleValue(style, 'height') +
        getParsedStyleValue(style, 'padding-top') +
        getParsedStyleValue(style, 'padding-bottom') +
        getParsedStyleValue(style, 'border-top-width') +
        getParsedStyleValue(style, 'border-bottom-width');

    return height > 0 ? height : chartHeight;
};

//function that hides overlapping ticks on x axis, tickCount variable specify how many ticks we want to see on x axis,
//orginal function is using getBoundingClientRect which is not implemented in jsdom (or return 0 values)
//so that's the simple solution hide tick labels
Plottable.Axis.AbstractAxis.prototype._hideOverlappingTickLabels = function () {
    var visibleTickLabels = [];
    d3.selectAll('.x-axis .tick-label-container .tick-label').each(function () {
        visibleTickLabels.push(this);
    });
    var tickInterval = Math.round(visibleTickLabels.length / tickCount);
    var tickLabel;

    for (var i = 0; i < visibleTickLabels.length; i++) {
        tickLabel = d3.select(visibleTickLabels[i]);
        if (i % tickInterval === 0) {
            tickLabel.style('visibility', 'visible');
        } else {
            tickLabel.style('visibility', 'hidden');
        }
    }
};

//setter for width and height for chart
Plottable.setChartDimensions = function (width, height) {
    chartHeight = height;
    chartWidth = width;
};

module.exports = Plottable;
