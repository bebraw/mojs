exports.transformLine = transformLine;

function transformLine(a) {
    return lambda(a);
}

function lambda(a) {
    return a.replace(/[(]([^\)]+)[)].*=>([^\/]*)(\/.*)?|(\/*.*)?/, function(orig, params, expr, comment) {
        if(!params || !expr) return orig;
        comment = comment? ' ' + comment: '';
        
        return 'function(' + params.trim() + ') {return ' + expr.trim() + ';}' + comment;
    });
}

