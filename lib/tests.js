#!/usr/bin/env node
var suite = require('suite.js');
var s = require('./snakescript');

suite(s.transformLine, {
    'foo': 'foo',
    '@foo': 'this.foo',
    '@foo + @bar': 'this.foo + this.bar',
    '() => ({})': 'function() {return {};}',
    '() => (x)': 'function() {return x;}',
    '(x) => x': 'function(x) {return x;}',
    '(x) => x // bar': 'function(x) {return x;} // bar',
    '(x) => x /* maa': 'function(x) {return x;} /* maa',
    '(x) => x * x': 'function(x) {return x * x;}',
    '(x, y) => x + y': 'function(x, y) {return x + y;}'
});

// TODO: might want to support dynamic binding and blocks {}
// http://www.yuiblog.com/blog/2012/03/30/what-is-the-meaning-of-this

