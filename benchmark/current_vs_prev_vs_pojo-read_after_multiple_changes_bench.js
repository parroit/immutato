/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');
var immutato_prev = require('../..');
var immutato = require('../lib/immutato.js');


var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        var Imm = immutato_prev.struct({
            name: immutato_prev.String,
            age: immutato_prev.Number
        }, 'Person');

        suite.immPrev = new Imm({
            name: 'Andrea',
            age: 38
        });

        suite.immCurr = immutato({
            name: 'Andrea',
            age: 38
        });

        suite.pojo = {
            name: 'Andrea',
            age: 38
        };

        Object.freeze(suite.pojo);

        var pojoCounter = 0;
        var prevCounter = 0;
        var currCounter = 0;
        var iterations = 10000;
        while (iterations--) {
            suite.immCurr = suite.immCurr.age(iterations);
            suite.immPrev = suite.immPrev.set('age', iterations);
            suite.pojo = assign({},suite.pojo);
            suite.pojo.age = iterations;
            Object.freeze(suite.pojo);
        }

    },

    name: 'current vs prev version vs pojo -- read property after multiple changes',

    tests: {

        'current version': function() {
            var age = suite.immCurr.age();
            
        },


        'previous version': function() {
            var age = suite.immPrev.age;
        },

        'pojo': function() {
            var age = suite.pojo.age;
        }

    }
};

suite.setup();

