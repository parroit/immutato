/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
    namedFunction: namedFunction
};

function namedFunction(name, fn) {
    var cnstr;
    //jshint evil:true
    eval('cnstr = function ' + name + '(){' + (fn ? 'return fn.apply(this,arguments);' : '') + '}');
    return cnstr;
}
