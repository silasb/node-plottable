
var d3 = require('d3');
var path = require('path');
var fs = require('fs');
var juice = require('juice');
var window = global.window = d3.select('*')[0][0]._ownerDocument._parentWindow;
var document = window.document;
var navigator = {};
navigator.userAgent = 'WebKit';

var Plottable = require('./plottable/plottable.js').node_plottable(window, document, navigator);

var chartWidth= 750;
var chartHeight = 500;
var tickCount = 10;
var PLOTTABLE_CSS_PATH = path.join(__dirname, 'plottable', 'plottable.css');
var plottableCss = fs.readFileSync(PLOTTABLE_CSS_PATH, {encoding: 'utf8'});



Plottable.inlineStyle = function(svg) {
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

Plottable._Util.DOM.getElementWidth = function (elem) {
    var style = window.getComputedStyle(elem);
    var width = getParsedStyleValue(style, 'width') +
        getParsedStyleValue(style, 'padding-left') +
        getParsedStyleValue(style, 'padding-right') +
        getParsedStyleValue(style, 'border-left-width') +
        getParsedStyleValue(style, 'border-right-width');

    return width > 0 ? width : chartWidth;
};

Plottable._Util.DOM.getElementHeight = function (elem) {
    var style = window.getComputedStyle(elem);
    var height = getParsedStyleValue(style, 'height') +
        getParsedStyleValue(style, 'padding-top') +
        getParsedStyleValue(style, 'padding-bottom') +
        getParsedStyleValue(style, 'border-top-width') +
        getParsedStyleValue(style, 'border-bottom-width');

    return height > 0 ? height : chartHeight;
};

Plottable.Axis.AbstractAxis.prototype._hideOverlappingTickLabels = function () {
    var visibleTickLabels = [];
    d3.selectAll('.x-axis .tick-label-container .tick-label').each(function() {

        visibleTickLabels.push(this);
    });
    var tickInterval = Math.round(visibleTickLabels.length / tickCount);
    var tickLabel;

    for(var i = 0; i < visibleTickLabels.length; i++) {
        tickLabel = d3.select(visibleTickLabels[i]);
        if(i % tickInterval === 0) {
            tickLabel.style("visibility", "visible");
        } else {
            tickLabel.style("visibility", "hidden");
        }
    }
};

function calculateTicks(ticks) {
    var result = [];
    if(ticks.length > 5) {
        var tickDiff = (ticks[ticks.length - 1] - ticks[0]) / 5;
        result.push(ticks[0]);
        for(var i = 0; i < 5; ++i) {
            result[i + 1] = result[i] + tickDiff;
        }
    } else {
        result = ticks;
    }

    return result;
}

Plottable.Axis.Numeric.prototype._getTickValues = function () {
    return calculateTicks(this._scale.ticks());
};

Plottable.Component.Gridlines.prototype.redrawYLines = function () {
    var _this = this;
    if (this.yScale) {
        var yTicks = calculateTicks(this.yScale.ticks());//this.yScale.ticks();
        var getScaledYValue = function (tickVal) { return _this.yScale.scale(tickVal); };
        var yLines = this.yLinesContainer.selectAll("line").data(yTicks);
        yLines.enter().append("line");
        yLines.attr("x1", 0).attr("y1", getScaledYValue).attr("x2", this.width()).attr("y2", getScaledYValue).classed("zeroline", function (t) { return t === 0; });
        yLines.exit().remove();
    }
};

Plottable.setChartDimensions = function(width, height) {
    chartHeight = height;
    chartWidth = width;
};

module.exports = Plottable;

if ('window' in globals) {

    global.window = globals.window;
} else {
    delete global.window;
}

