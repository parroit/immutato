/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = null;
var immutato = require('./immutato');
var toString = Object.prototype.toString;

immutato.DateType = {
    name: 'Date',
    assertIs: function(value, name) {

        if (typeof value !== 'object' || toString.call(value) !== '[object Date]') {
            throw new TypeError(name + ' should be a Date, but `' + value + '` was given.');
        }
    },

    from: function(value) {

        return new Date(value);
    }
};
