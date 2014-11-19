/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';


var immutato_prev = require('../..');
var immutato = require('../lib/immutato.js');


var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        suite.Imm = immutato_prev.struct({
            name: immutato_prev.String,
            age: immutato_prev.Number
        }, 'Person');
    },

    name: 'current vs prev version vs pojo -- immutable object creation',

    tests: {

        'current version': function() {
            var imm = immutato({
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

