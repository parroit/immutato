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

        suite.immPrev = new Imm(payloadProps);
        suite.immCurr = $f(payloadProps);
        suite.pojo = assign({},payloadProps);
        suite.immJs = Immutable.Map(payloadProps);


        Object.freeze(suite.pojo);

        var pojoCounter = 0;
        var prevCounter = 0;
        var currCounter = 0;
        var immJsCounter = 0;

        var iterations = 10000;
        while (iterations--) {
            suite.immCurr = suite.immCurr.age(iterations);
            suite.immPrev = suite.immPrev.set('age', iterations);
            suite.immJs = suite.immJs.set('age', iterations);
            suite.pojo = assign({},suite.pojo);
            suite.pojo.age = iterations;
            Object.freeze(suite.pojo);
        }

    },

    name: 'current vs prev version vs pojo -- read property after multiple changes',

    tests: {
        'current version': {
            fn: function() {
                var name = suite.immCurr.name();
            },
            onComplete: function(){
                suite.immCurr.dispose();
            }
        },
        
        'immutable.js': function() {
            var name = suite.immJs.get('name');

        },

        'previous version': function() {
            var name = suite.immPrev.name;
        },

        'pojo': function() {
            var name = suite.pojo.name;
        }

    }
};

suite.setup();

