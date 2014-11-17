'use strict';

var d3 = require('d3');
var assert = require('assert');

//patch for memory leak
function patchedOn () {
    console.log('d3.selection.prototype.on is disabled in node-plottable');
};
d3.selection.prototype.on = patchedOn;

var path = require('path');
var fs = require('fs');
var juice = require('juice');
var window = d3.select('*')[0][0]._ownerDocument._parentWindow;
var document = window.document;
var navigator = {};
navigator.userAgent = 'WebKit';
//Plottable require global d3 object
global.d3 = d3;
var Plottable = require('plottable.js')(window, document, navigator);

var chartWidth;
var chartHeight;
var tickCount;

var PLOTTABLE_CSS_PATH = path.join(__dirname, 'node_modules', 'plottable.js', 'plottable.css');
var plottableCss = fs.readFileSync(PLOTTABLE_CSS_PATH, {encoding: 'utf8'});

//patch for memory leak to prevent registering window.addEventListener
Plottable.Component.AbstractComponent.prototype.autoResize = function () {
    console.log('Plottable.Component.AbstractComponent.prototype.autoResize is disabled in node-plottable');
    Plottable.Core.ResizeBroadcaster.deregister(this);
    return this;
};

function getBodyContent(html){
    return html.split('<html><body>')[1].split('</body></html>')[0];
}

//function will add inline styles to svg chart
function inlineStyle (svg) {
    var svgHtml = juice.inlineContent(svg, plottableCss);
    return getBodyContent(svgHtml);
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

Plottable.Component.AbstractComponent.prototype.renderString = function () {
    var svg = d3.select('body').append('svg').attr('id', 'contentSVG');

    this.renderTo('svg#contentSVG');

    var svgString = svg[0][0].parentNode.innerHTML;
    var res = inlineStyle(svgString);

    svg.remove();
    return res;
};


module.exports = function factory(config) {
    ['width', 'height', 'ticks'].forEach(function (property) {
        assert.equal(typeof config[property], 'number');
    });
    chartWidth = config.width;
    chartHeight = config.height;
    tickCount = config.ticks;
    return Plottable;
};
