/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';


var immutato = require('../../lib/immutato.js');
var $f = require('../lib/immutato.js');


var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        suite.Imm = immutato.struct({
            name: immutato.String,
            age: immutato.Number
        }, 'Person');
    },

    name: 'current vs prev version vs pojo -- immutable object creation',

    tests: {

        'current version': function() {
            var imm = $f({
                name: 'Andrea',
                age: 38
            });

        },


        'previous version': function() {
            var imm = new suite.Imm({
                name: 'Andrea',
                age: 38
            });
        },

        'pojo': function() {
            var imm = {
                name: 'Andrea',
                age: 38
            };
            Object.freeze(imm);
        }

    }
};

suite.setup();

