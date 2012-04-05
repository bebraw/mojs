#!/usr/bin/env node
var suite = require('suite.js');
var s = require('./snakescript');

var transformLine = s.partial(s.transformLine, s.features);

suite(transformLine, {
    'foo': 'foo',
    'a = 5': 'a = 5'
});

suite(s.features.lambda, {
    '() => ({})': 'function() {return {};}',
    '() => (x)': 'function() {return x;}',
    '(x) => x': 'function(x) {return x;}',
    '(x) => x // bar': 'function(x) {return x;} // bar',
    '(x) => x /* maa': 'function(x) {return x;} /* maa',
    '(x) => x * x': 'function(x) {return x * x;}',
    '(x, y) => x + y': 'function(x, y) {return x + y;}',
    'var fst = (a, b) => a;': 'var fst = function(a, b) {return a;}'
});

suite(s.features.atThis, {
    '@foo': 'this.foo',
    '@foo + @bar': 'this.foo + this.bar'
});

dsuite(s.features.destructuring, {
    'let {x, y} = pt': 'var x = pt.x; var y = pt.y;',
    'let [a, b] = double()': 'var a = double(); var b = a[1]; a = a[0];',
    'let [s, v, o] = triple()': 'var s = triple(); var v = s[1]; var o = s[2]; s = s[0];'
});

dsuite(s.features.parameterDefaultValues, {
    // TODO: check if arguments are undefined instead (fails with zero now)
    'function f(x, y=1, z=0) {': 'function f(x) {var y = arguments[0] || 1; var z = arguments[1] || 0;'
});

dsuite(s.features.rest, {
     // TODO: implement slice for arguments
     // TODO: make this work with parameter default values
    'function g(i, j, ...r) {': 'function g(i, j) {var r = arguments.slice(2);'
});

dsuite(s.features.spread, {
    'var o = f(...a)': 'var o = function() {return f.apply(null, a);}();'
});

dsuite(s.features.comprehensions, {
    'ret = [a for a in items]': 'ret = items.map(function(a) {return a;})',
    'ret2 = [a * b for a in items2]': 'ret2 = items2.map(function(a) {return a * b;})',
    'ret = [a * 2 for a in A if a > 5]': 'ret = A.filter(function(a) {return a > 5;}).map(function(a) {return a * 2;})'
    // TODO: support more cases (perhaps ES.next syntax even)
});

dsuite(s.features.parenFree, {
    'if x > y return x': 'if(x > y) return x',
    'while i < n { a.push(i++); }': 'while(i < n) { a.push(i++); }'
});

function dsuite() {}

// TODO: might want to support dynamic binding and blocks {}
// http://www.yuiblog.com/blog/2012/03/30/what-is-the-meaning-of-this

// See also http://www.slideshare.net/BrendanEich/esnext
//
