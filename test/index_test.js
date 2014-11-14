'use strict';

var jsdom = require('jsdom');
var document = jsdom.jsdom('<html><head></head><body></body></html>');
var window = document.parentWindow;
var chart = require('../example');
var assert = require('assert');
var factory = require('../index');

describe('node-plottable', function () {
    describe('content', function () {
        var html = chart.getExample();
        var doc = document.createElement('div');
        doc.innerHTML = html;
        //jsdom will create a DOM tree based on the HTML string
        //comparing elements will tel us if the jsdom needed to change anything.
        it('check if returned string is valid HTML', function () {
            assert.equal(doc.innerHTML, html);
        });
    });

    describe('factory', function () {
        var config;
        beforeEach(function () {
            config = {
                width: 2,
                height: 2,
                ticks: 2
            };
        });

        ['width', 'height', 'ticks'].forEach(function (prop) {
            it('should throw an error if ' + prop + ' is not provided', function () {
                delete config[prop];
                assert.throws(function () {
                    factory(config);
                });
            });
        });

        describe('returns an instance which', function () {
            var instance;
            beforeEach(function () {
                instance = factory(config);
            });

            it('has a renderString method', function () {
                var renderString = instance.Component.AbstractComponent.prototype.renderString;
                assert.equal(typeof renderString, 'function');
            });
        });
    });
});
