#!/usr/bin/env node
var suite = require('suite.js');
var s = require('./snakescript');

// general
suite(s.transformLine, {
    'foo': 'foo',
    'a = 5': 'a = 5'
});

// lambdas
suite(s.transformLine, {
    '() => ({})': 'function() {return {};}',
    '() => (x)': 'function() {return x;}',
    '(x) => x': 'function(x) {return x;}',
    '(x) => x // bar': 'function(x) {return x;} // bar',
    '(x) => x /* maa': 'function(x) {return x;} /* maa',
    '(x) => x * x': 'function(x) {return x * x;}',
    '(x, y) => x + y': 'function(x, y) {return x + y;}',
    'var fst = (a, b) => a;': 'var fst = function(a, b) {return a;}'
});

// this
suite(s.transformLine, {
    '@foo': 'this.foo',
    '@foo + @bar': 'this.foo + this.bar'
});

// TODO: might want to support dynamic binding and blocks {}
// http://www.yuiblog.com/blog/2012/03/30/what-is-the-meaning-of-this

