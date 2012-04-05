exports.transform = transform;
exports.transformLine = transformLine;
exports.partial = partial;

var features = {};

function transform(data, feats) {
    feats = feats || features;

    return data.split('\n').map(partial(transformLine, feats)).join('\n');
}

function transformLine(feats, a) {
    var ret = a;

    for(var n in feats) {
        ret = feats[n](ret);
    }

    return ret;
}

features.atThis = function(a) {
    return a.replace(/@[^\ ]+/g, function(orig) {
        return 'this.' + ltrim(orig, '@');
    });
};

features.lambda = function(a) {
    return a.split(';').map(function(s) { return s.replace(/[(]([^\)]*)[)].*=>([^\/]*)((\/.*)|(\/*.*))?/,
            function(orig, params, expr, comment) {
        params = params.trim() || '';
        comment = comment? ' ' + comment: '';
        expr = rtrim(ltrim(rtrim(expr.trim(), ';'), '('), ')');

        return 'function(' + params + ') {return ' + expr + ';}' + comment;
    });}).join(';');
};

features.destructuring = function(a) {
    var parts = a.split('=');
    var vars;

    if(parts.length != 2) return a;

    var l = parts[0].trim();
    var r = parts[1].trim();

    if(-1 < l.indexOf('{') && l.indexOf('{') < l.indexOf('}')) {
        vars = l.slice(l.indexOf('{') + 1, l.indexOf('}')).split(',');

        return vars.map(function(v) {
            v = v.trim();
            return ' var ' + v + ' = ' + r + '.' + v + ';';
        }).join('').trim();
    }

    if(-1 < l.indexOf('[') && l.indexOf('[') < l.indexOf(']')) {
        vars = l.slice(l.indexOf('[') + 1, l.indexOf(']')).split(',');

        return 'var ' + vars[0] + ' = ' + r + '; ' + vars.slice(1, vars.length).map(function(v, i) {
            v = v.trim();
            return ' var ' + v + ' = ' + vars[0] + '[' + (i + 1)  + '];';
        }).join('').trim() + ' '  + vars[0] + ' = ' + vars[0] + '[0];';
    }

    return a;
};

features.parameterDefaultValues = function(a) {
    return a;
};

features.rest = function(a) {
    return a;
};

features.spread = function(a) {
    return a;
};

features.comprehensions = function(a) {
    return a;
};

features.parenFree = function(a) {
    return a;
};

exports.features = features;

// http://stackoverflow.com/questions/4394747/javascript-curry-function
function partial(fn) {
    var slice = Array.prototype.slice;
    var args = slice.apply(arguments, [1]);

    return function() {
        return fn.apply(null, args.concat(slice.apply(arguments)));
    };
}

// http://phpjs.org/functions/ltrim:467
function ltrim(str, charlist) {
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    var re = new RegExp('^[' + charlist + ']+', 'g');
    return (str + '').replace(re, '');
}

// http://phpjs.org/functions/rtrim:507
function rtrim(str, charlist) {
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '').replace(re, '');
}

