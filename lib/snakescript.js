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

// TODO: make sure this works if there are multiple lambdas on the same line
features.lambda = function(a) {
    return a.replace(/[(]([^\)]*)[)].*=>([^\/]*)((\/.*)|(\/*.*))?/,
            function(orig, params, expr, comment) {
        params = params.trim() || '';
        comment = comment? ' ' + comment: '';
        expr = rtrim(ltrim(rtrim(expr.trim(), ';'), '('), ')');

        return 'function(' + params + ') {return ' + expr + ';}' + comment;
    });
};

features.destructuring = function(a) {
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

