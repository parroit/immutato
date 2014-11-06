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

immutato.StringType = {
    name: 'String',
    assertIs: function(value, name) {
        if (typeof value !== 'string') {
            throw new TypeError(name + ' should be a String, but `' + value + '` was given.');
        }
    },

    from: function(value) {
        if (value === null || value === undefined) {
            return '';
        }
        return value.toString();
    }
};
