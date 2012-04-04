exports.transformLine = transformLine;

function transformLine(a) {
    return lambda(a);
}

function lambda(a) {
    return a.replace(/[(]([^\)]+)[)].*=>(.*)/, function(orig, params, expr) {
        return 'function(' + params.trim() + ') {return ' + expr.trim() + ';}'
    });
}

