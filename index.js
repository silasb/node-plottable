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
if ('navigator' in global) globals.navigator = global.navigator;
global.navigator = {};
global.navigator.userAgent = 'WebKit';
global.chartSettings = {
    CHART_WIDTH: 750,
    CHART_HEIGHT: 500
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

if ('window' in globals) global.window = globals.window;
else delete global.window;
if ('document' in globals) global.document = globals.document;
else delete global.document;
if ('navigator' in globals) global.navigator = globals.navigator;
else delete global.navigator;
delete global.chartSettings;
