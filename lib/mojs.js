exports.transform = transform;
exports.transformLine = transformLine;
exports.transformFragment = transformFragment;

var f = require('funkit');

var features = {};

function transform(data, feats) {
    feats = feats || features;

    return data.split('\n').map(f.partial(transformLine, feats)).join('\n');
}

function transformLine(feats, line) {
    return line.split(';').map(f.partial(transformFragment, feats)).join(';');
}

function transformFragment(feats, a) {
    var ret = a;
    
    for(var n in feats) {
        ret = feats[n](ret);
    }

    return ret;
}

features.atThis = function(a) {
    return a.replace(/@[^\ ]+/g, function(orig) {
        return 'this.' + f.ltrim(orig, '@');
    });
};

features.lambda = function(a) {
    return a.replace(/[(]([^\)]*)[)].*=>([^\/]*)((\/.*)|(\/*.*))?/,
            function(orig, params, expr, comment) {
        params = params.trim() || '';
        comment = comment? ' ' + comment: '';
        expr = f.rtrim(f.ltrim(f.rtrim(expr.trim(), ';'), '('), ')');

        return 'function(' + params + ') {return ' + expr + ';}' + comment;
    });
};

features.destructuring = function(a) {
    var parts = a.split('=');
    var vars;

    if(parts.length != 2) return a;

    var l = parts[0].trim();
    var r = f.rtrim(parts[1].trim(), ';');

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
    var parts = a.split('=');

    if(parts.length != 2) return a;

    var l = f.rtrim(parts[0], ' ');
    var r = f.rtrim(parts[1].trim(), ';');

    if(r[0] == '[' && r[r.length - 1] == ']') {
        r = r.slice(1, r.length - 1);
        var segments = r.split('for');

        // TODO: might want to support multiple fors
        if(segments.length != 2) return a;

        var op = segments[0].trim();
        var sR = segments[1];
        var sRparts = sR.split('if');
        var varName = sRparts[0].trim().split(' ')[0];
        var listName = f.last(sRparts[0].trim().split(' ')).trim();
        var ret = l + ' = ' + listName + '.';

        if(sRparts.length == 2) {
            var ifClause = sRparts[1].trim();
            ret += 'filter(function(' + varName  + ') {return ' + ifClause + ';}).';
        }

        ret += 'map(function(' + varName + ') {return ' + op  +';})';

        return ret;
    }

    return a;
};

features.parenFree = function(a) {
    return a;
};

exports.features = features;
