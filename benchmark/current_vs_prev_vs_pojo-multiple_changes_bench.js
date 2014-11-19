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

        suite.pojoCounter = 0;
        suite.prevCounter = 0;
        suite.currCounter = 0;
        Object.freeze(suite.pojo);
    },

    name: 'current vs prev version vs pojo -- change properties multiple times',

    tests: {

        'current version': function() {

            suite.immCurr = suite.immCurr.age(suite.currCounter++);
        },


        'previous version': function() {
            suite.immPrev = suite.immPrev.set('age', suite.prevCounter++);
        },

        'pojo': function() {
            suite.pojo = assign({},suite.pojo);
            suite.pojo.age = suite.pojoCounter++;
            Object.freeze(suite.pojo);
        }

    }
};

suite.setup();

