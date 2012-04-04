#!/usr/bin/env node
var suite = require('suite.js');
var s = require('./snakescript');

suite(s.transformLine, {
    'foo': 'foo',
    '(x) => x': 'function(x) {return x;}',
    '(x) => x * x': 'function(x) {return x * x;}',
    '(x, y) => x + y': 'function(x, y) {return x + y;}'
});

