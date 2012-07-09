var items = [1, 3, 10, 23, 2];
var a = items.map(function(i) {return i * 2;});
var b = items.filter(function(i) {return i > 4;}).map(function(i) {return i;});
