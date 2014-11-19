/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');
var immutato = require('../../lib/immutato.js');
var $f = require('../lib/immutato.js');


var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        var Imm = immutato.struct({
            name: immutato.String,
            age: immutato.Number
        }, 'Person');

        suite.immPrev = new Imm({
            name: 'Andrea',
            age: 38
        });

        suite.immCurr = $f({
            name: 'Andrea',
            age: 38
        });

        suite.pojo = {
            name: 'Andrea',
            age: 38
        };
        Object.freeze(suite.pojo);
    },

    name: 'current vs prev version vs pojo -- create a copy of immutable object with changed property',

    tests: {

        'current version': function() {
            suite.immCurr.age(42);
        },


        'previous version': function() {
            suite.immPrev.set('age', 42);
        },

        'pojo': function() {
            var copy = assign({},suite.pojo);
            copy.age = 42;
            Object.freeze(copy);
        }

    }
};

suite.setup();
