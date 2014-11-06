/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {
    name: 'Boolean',
    assertIs: function(value, name) {

        if (typeof value !== 'boolean') {
            throw new TypeError(name + ' should be a Boolean, but `' + value + '` was given.');
        }
    },

    from: function(value) {
        if (value === 'true' || value === '1' || value === 1 || value === 'on' || value === 'yes') {
            return true;
        }

        if (value === 'false' || value === '0' || value === 0 || value === 'off' || value === 'no') {
            return false;
        }

        return !!value;
    }
};
