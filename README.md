Plottable for Node
==================

**WARNING: THIS IS AN ALPHA AND NOT INTENDED FOR PRODUCTION USE**

Wrapper for Plottable charts to generate them in Node.
index.js contain stubs for Plottable functions that had to be overridden to generate charts on the server side.

Installation
------------
    $ npm install

Usage
-----

It can be required and used with any other module:

    var Plottable = require('node-plottable');
    var xScale = new Plottable.Scale.Ordinal(); ...

Example
-------
example can be run using:

    node example.js

Testing
-------

Unit tests can be run using make:

    $ make test


Dependencies
------------

 d3
 jsdom
 brandwatch/plottable
 juice
 underscore
 mocha

Authors
-------

Piotr Donicz <piotr@brandwatch.com>
