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

// destructuring
suite(s.transformLine, {
    'let {x, y} = pt': 'var x = pt.x; var y = pt.y;',
    'let [a, b] = double()': 'var a = double(); var b = a[1]; a = a[0];',
    'let [s, v, o] = triple()': 'var s = triple(); var v = s[1]; var o = s[2]; s = s[0];'
});

// parameter default values
suite(s.transformLine, {
    // TODO: check if arguments are undefined instead (fails with zero now)
    'function f(x, y=1, z=0) {': 'function f(x) {var y = arguments[0] || 1; var z = arguments[1] || 0;'
});

// rest
suite(s.transformLine, {
     // TODO: implement slice for arguments
     // TODO: make this work with parameter default values
    'function g(i, j, ...r) {': 'function g(i, j) {var r = arguments.slice(2);'
});

// TODO: might want to support dynamic binding and blocks {}
// http://www.yuiblog.com/blog/2012/03/30/what-is-the-meaning-of-this

