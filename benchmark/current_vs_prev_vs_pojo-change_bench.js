/*
 * immutato
 * https://github.com/parroit/immutato
 *
 * Copyright (c) 2014 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var assign = require('object-assign');
var immutato_prev = require('../../');
var immutato = require('../lib/immutato');
var Immutable = require('immutable');


var suite = module.exports = {
    maxTime: 2,
    setup: function() {
        var i = 100;
        var payloadTypes = {
            name: immutato_prev.String,
            age: immutato_prev.Number
        };

        var payloadProps = {
            name: 'Andrea',
            age: 38
        };


        while(i--) {
            payloadTypes['field'+i] = immutato_prev.Number;
            payloadProps['field'+i] = i;
        }


        var Imm = immutato_prev.struct(payloadTypes, 'Person');
        var $f = immutato(payloadProps);


        suite.immJs = Immutable.Map(suite.payloadProps);
        suite.immPrev = new Imm(payloadProps);

        suite.immCurr = $f(payloadProps);

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

        'immutable.js': function() {
            suite.immJs.set('age', 42);

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
