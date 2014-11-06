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

immutato.NumberType = {
    name: 'Number',
    assertIs: function(value, name) {
        if (typeof value !== 'number' || isNaN(value) || value === Infinity) {
            throw new TypeError(name + ' should be a Number, but `' + value + '` was given.');
        }
    },

    from: function(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return 0;
        }
        return parseFloat(value);
    }
};
