exports.transform = transform;
exports.transformLine = transformLine;

function transform(data) {
    return data.split('\n').map(transformLine).join('\n');
}

function transformLine(a) {
    return atThis(lambda(a));
}

function atThis(a) {
    return a.replace(/@[^\ ]+/g, function(orig) {
        return 'this.' + ltrim(orig, '@');
    });
}

function lambda(a) {
    return a.replace(/[(]([^\)]*)[)].*=>([^\/]*)((\/.*)|(\/*.*))?/,
            function(orig, params, expr, comment) {
        params = params.trim() || '';
        comment = comment? ' ' + comment: '';
        expr = rtrim(ltrim(expr.trim(), '('), ')');

        return 'function(' + params + ') {return ' + expr + ';}' + comment;
    });
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

